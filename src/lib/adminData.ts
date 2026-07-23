import "server-only";
import { writeClient } from "./sanityWrite";

export type AdminAttachment = { _key: string; name: string; fileUrl: string | null };

export type AdminDoc = {
  _id: string;
  _rev: string;
  name: string;
  category: string;
  date: string;
  slug: string;
  notice: boolean;
  summary: string;
  body: string[];
  fileUrl: string | null;
  attachments: AdminAttachment[];
};

const DOC_FIELDS = `_id,_rev,name,category,date,notice,"slug":coalesce(slug.current,slug),summary,body,"fileUrl":file.asset->url,attachments[]{_key,name,"fileUrl":file.asset->url}`;

export async function adminGetDocs(): Promise<AdminDoc[]> {
  if (!writeClient) return [];
  const r = await writeClient.fetch<AdminDoc[]>(`*[_type=="doc"]|order(notice desc, date desc){${DOC_FIELDS}}`);
  return (r ?? []).map((d) => ({ ...d, body: d.body ?? [], attachments: d.attachments ?? [] }));
}

export async function adminGetDocById(id: string): Promise<AdminDoc | null> {
  if (!writeClient) return null;
  const r = await writeClient.fetch<AdminDoc | null>(`*[_id==$id][0]{${DOC_FIELDS}}`, { id });
  return r ? { ...r, body: r.body ?? [], attachments: r.attachments ?? [] } : null;
}
