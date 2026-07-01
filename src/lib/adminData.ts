import "server-only";
import { writeClient } from "./sanityWrite";

export type AdminNews = {
  _id: string;
  title: string;
  category: string;
  date: string;
  accent: boolean;
  slug: string;
  summary: string;
  body: string[];
};

export type AdminAttachment = { _key: string; name: string; fileUrl: string | null };

export type AdminDoc = {
  _id: string;
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

const NEWS_FIELDS = `_id,title,category,date,accent,"slug":coalesce(slug.current,slug),summary,body`;
const DOC_FIELDS = `_id,name,category,date,notice,"slug":coalesce(slug.current,slug),summary,body,"fileUrl":file.asset->url,attachments[]{_key,name,"fileUrl":file.asset->url}`;

export async function adminGetNews(): Promise<AdminNews[]> {
  if (!writeClient) return [];
  const r = await writeClient.fetch<AdminNews[]>(`*[_type=="newsPost"]|order(date desc){${NEWS_FIELDS}}`);
  return (r ?? []).map((n) => ({ ...n, body: n.body ?? [] }));
}

export async function adminGetNewsById(id: string): Promise<AdminNews | null> {
  if (!writeClient) return null;
  const r = await writeClient.fetch<AdminNews | null>(`*[_id==$id][0]{${NEWS_FIELDS}}`, { id });
  return r ? { ...r, body: r.body ?? [] } : null;
}

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
