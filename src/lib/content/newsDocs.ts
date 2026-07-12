import { configuredRequest, type ContentRequest } from "./client";
import type { Catalog, CertItem, DocItem, NewsItem } from "./types";

type NewsRecord = {
  readonly category?: string;
  readonly title?: string;
  readonly date?: string;
  readonly accent?: boolean;
  readonly slug?: string;
  readonly summary?: string;
  readonly body?: unknown;
};

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

const NEWS_Q = `*[_type=="newsPost"]|order(date desc){category,title,date,accent,"slug":coalesce(slug.current,slug),summary,body}`;
const DOCS_Q = `*[_type=="doc"]|order(date desc){name,category,date,"file":coalesce(file.asset->url,""),"slug":coalesce(slug.current,slug),summary,body,notice,attachments[]{name,"file":coalesce(file.asset->url,file)}}`;
const CATALOG_Q = `*[_type=="catalog"]|order(_updatedAt desc)[0]{title,tagline,"file":coalesce(file.asset->url,"")}`;
const CERTS_Q = `*[_type=="cert"]|order(order asc){eyebrow,title,standard,desc,issuer,number,scope,validity,"imageKo":coalesce(imageKo.asset->url,""),"imageEn":coalesce(imageEn.asset->url,"")}`;

export const EMPTY_CATALOG: Catalog = { title: "제품 카탈로그", tagline: "", file: "" };

function normalizeNewsItem(item: NewsRecord, index: number): NewsItem {
  const title = item.title ?? "공지사항";
  const body = Array.isArray(item.body)
    ? item.body.filter((entry): entry is string => typeof entry === "string")
    : [];
  return {
    category: item.category ?? "공지",
    title,
    date: item.date ?? "",
    accent: Boolean(item.accent),
    slug: item.slug ?? `notice-${index + 1}`,
    summary: item.summary ?? body[0] ?? title,
    body,
  };
}

function normalizeDocItem(item: DocRecord, index: number): DocItem {
  const attachments = (item.attachments ?? []).flatMap((attachment) =>
    attachment.file
      ? [{ name: attachment.name ?? "첨부 PDF", file: attachment.file }]
      : [],
  );
  const file = item.file ?? attachments[0]?.file ?? "";
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

export async function readNews(request: ContentRequest<readonly NewsRecord[] | null> | null): Promise<NewsItem[]> {
  if (!request) return [];
  const records = await request(NEWS_Q);
  return (records ?? []).map(normalizeNewsItem);
}

export async function getNews(): Promise<NewsItem[]> {
  return readNews(configuredRequest());
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  return (await getNews()).find((item) => item.slug === slug);
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

export async function readCatalog(request: ContentRequest<Catalog | null> | null): Promise<Catalog> {
  if (!request) return EMPTY_CATALOG;
  const catalog = await request(CATALOG_Q);
  return catalog?.file ? catalog : EMPTY_CATALOG;
}

export async function getCatalog(): Promise<Catalog> {
  return readCatalog(configuredRequest());
}

export async function readCerts(request: ContentRequest<readonly CertItem[] | null> | null): Promise<CertItem[]> {
  if (!request) return [];
  return [...((await request(CERTS_Q)) ?? [])];
}

export async function getCerts(): Promise<CertItem[]> {
  return readCerts(configuredRequest());
}
