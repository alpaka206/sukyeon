import { sanityClient } from "./sanity";

// 콘텐츠 어댑터: Sanity를 단일 원본으로 사용한다.
// Sanity가 미설정이거나 조회에 실패하면(크래시 대신) 빈 값을 반환해 페이지가 안전하게 비워진다.

export type NewsItem = {
  readonly category: string;
  readonly title: string;
  readonly date: string;
  readonly accent: boolean;
  readonly slug: string;
  readonly summary: string;
  readonly body: readonly string[];
};
export type DocAttachment = {
  readonly name: string;
  readonly file: string;
};
export type DocItem = {
  readonly name: string;
  readonly category: string;
  readonly date: string;
  readonly file: string;
  readonly slug: string;
  readonly summary: string;
  readonly body: readonly string[];
  readonly attachments: readonly DocAttachment[];
  readonly notice: boolean;
};
export type Catalog = { title: string; tagline: string; file: string };
export type CertItem = {
  eyebrow: string;
  title: string;
  standard: string;
  desc: string;
  issuer: string;
  number: string;
  scope: string;
  validity: string;
  imageKo: string;
  imageEn: string;
};

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

function normalizeNewsItem(item: NewsRecord, index: number): NewsItem {
  const title = item.title ?? "공지사항";
  const body = Array.isArray(item.body) ? item.body.filter((entry): entry is string => typeof entry === "string") : [];
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
  const attachments = (item.attachments ?? [])
    .filter((attachment) => Boolean(attachment.file))
    .map((attachment) => ({
      name: attachment.name ?? "첨부 PDF",
      file: attachment.file ?? "",
    }));
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

export async function getNews(): Promise<NewsItem[]> {
  if (!sanityClient) return [];
  try {
    const r = await sanityClient.fetch<NewsRecord[]>(NEWS_Q);
    return (r ?? []).map(normalizeNewsItem);
  } catch (e) {
    console.error("[content] Sanity 공지 조회 실패:", e);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const items = await getNews();
  return items.find((item) => item.slug === slug);
}

export async function getDocs(): Promise<DocItem[]> {
  if (!sanityClient) return [];
  try {
    const r = await sanityClient.fetch<DocRecord[]>(DOCS_Q);
    return sortDocs((r ?? []).map(normalizeDocItem));
  } catch (e) {
    console.error("[content] Sanity 자료 조회 실패:", e);
    return [];
  }
}

export async function getDocBySlug(slug: string): Promise<DocItem | undefined> {
  const items = await getDocs();
  return items.find((item) => item.slug === slug);
}

const EMPTY_CATALOG: Catalog = { title: "제품 카탈로그", tagline: "", file: "" };

export async function getCatalog(): Promise<Catalog> {
  if (!sanityClient) return EMPTY_CATALOG;
  try {
    const r = await sanityClient.fetch<Catalog | null>(CATALOG_Q);
    if (r?.file) return r;
  } catch (e) {
    console.error("[content] Sanity 카탈로그 조회 실패:", e);
  }
  return EMPTY_CATALOG;
}

export async function getCerts(): Promise<CertItem[]> {
  if (!sanityClient) return [];
  try {
    const r = await sanityClient.fetch<CertItem[]>(CERTS_Q);
    return r ?? [];
  } catch (e) {
    console.error("[content] Sanity 인증 조회 실패:", e);
    return [];
  }
}
