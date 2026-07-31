import { configuredRequest, type ContentRequest } from "./client";
import type { CertItem, DocAttachment, DocItem } from "./types";

/** 국문·영문이 함께 올라온 자료는 기본 링크가 국문을 가리켜야 한다. */
const KOREAN_ATTACHMENT = /국문|한글|\bkor(ean)?\b/i;

export function preferKoreanFile(attachments: readonly DocAttachment[], fallback: string): string {
  const korean = attachments.find((attachment) => attachment.file && KOREAN_ATTACHMENT.test(attachment.name));
  return korean?.file ?? fallback;
}

type DocAttachmentRecord = {
  readonly name?: string;
  readonly file?: string;
};

type DocRecord = {
  readonly name?: string;
  readonly category?: string;
  readonly date?: string;
  readonly file?: string;
  readonly slug?: string;
  readonly summary?: string;
  readonly body?: readonly string[];
  readonly attachments?: readonly DocAttachmentRecord[];
  readonly notice?: boolean;
};

const DOCS_Q = `*[_type=="doc"]|order(date desc){name,category,date,"file":coalesce(file.asset->url,""),"slug":coalesce(slug.current,slug),summary,body,notice,attachments[]{name,"file":coalesce(file.asset->url,file)}}`;
const CERTS_Q = `*[_type=="cert"]|order(order asc){title,standard,desc,issuer,number,scope,validity,"imageKo":coalesce(imageKo.asset->url,""),"imageEn":coalesce(imageEn.asset->url,"")}`;

function normalizeDocItem(item: DocRecord, index: number): DocItem {
  const attachments = (item.attachments ?? []).flatMap((attachment) =>
    attachment.file
      ? [{ name: attachment.name ?? "첨부 PDF", file: attachment.file }]
      : [],
  );
  const file = preferKoreanFile(attachments, item.file ?? attachments[0]?.file ?? "");
  const finalAttachments = attachments.length > 0 ? attachments : file ? [{ name: "PDF 다운로드", file }] : [];
  const name = item.name ?? "자료";
  const body = item.body?.filter((entry) => typeof entry === "string") ?? [];

  return {
    name,
    category: item.category ?? "자료",
    date: item.date ?? "",
    file,
    slug: item.slug ?? `doc-${index + 1}`,
    summary: item.summary ?? body[0] ?? name,
    body,
    attachments: finalAttachments,
    notice: Boolean(item.notice),
  };
}

function sortDocs(items: readonly DocItem[]): DocItem[] {
  return [...items].sort((a, b) => {
    if (a.notice !== b.notice) return a.notice ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export async function readDocs(request: ContentRequest<readonly DocRecord[] | null> | null): Promise<DocItem[]> {
  if (!request) return [];
  const records = await request(DOCS_Q);
  return sortDocs((records ?? []).map(normalizeDocItem));
}

export async function getDocs(): Promise<DocItem[]> {
  return readDocs(configuredRequest());
}

export async function getDocBySlug(slug: string): Promise<DocItem | undefined> {
  return (await getDocs()).find((item) => item.slug === slug);
}

export async function readCerts(request: ContentRequest<readonly CertItem[] | null> | null): Promise<CertItem[]> {
  if (!request) return [];
  return [...((await request(CERTS_Q)) ?? [])];
}

export async function getCerts(): Promise<CertItem[]> {
  return readCerts(configuredRequest());
}
