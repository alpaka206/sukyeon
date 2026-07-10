import "server-only";

import { writeClient } from "./sanityWrite";

export const CONTENT_TYPES = [
  "homePage",
  "aboutPage",
  "siteSettings",
  "productLineup",
  "productGallery",
  "newsPost",
  "doc",
  "catalog",
  "cert",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

const CONTENT_TYPE_SET = new Set<string>(CONTENT_TYPES);

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  homePage: "홈페이지",
  aboutPage: "회사소개",
  siteSettings: "사이트 설정",
  productLineup: "제품 라인업",
  productGallery: "제품 갤러리",
  newsPost: "공지사항",
  doc: "자료실",
  catalog: "카탈로그",
  cert: "인증·특허",
};

export const SINGLETON_DOCUMENT_IDS: Partial<Record<ContentType, string>> = {
  homePage: "homePage",
  aboutPage: "aboutPage",
  siteSettings: "siteSettings",
};

export type AdminContentDocument = {
  readonly id: string;
  readonly revision: string;
  readonly type: ContentType;
  readonly updatedAt: string;
  readonly title: string;
  readonly document: Record<string, unknown>;
};

export function isContentType(value: string): value is ContentType {
  return CONTENT_TYPE_SET.has(value);
}

export function contentDocumentTitle(document: Record<string, unknown>, fallback: string): string {
  for (const field of ["title", "name", "key"] as const) {
    const value = document[field];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

export async function adminGetContentDocuments(type: ContentType): Promise<AdminContentDocument[]> {
  if (!writeClient) return [];

  const documents = await writeClient.fetch<Record<string, unknown>[]>(
    `*[_type==$type]|order(_updatedAt desc){...}`,
    { type },
  );

  return (documents ?? []).flatMap((document) => {
    const id = document._id;
    const revision = document._rev;
    const updatedAt = document._updatedAt;
    if (typeof id !== "string" || typeof revision !== "string" || typeof updatedAt !== "string") return [];

    return [{
      id,
      revision,
      type,
      updatedAt,
      title: contentDocumentTitle(document, CONTENT_TYPE_LABELS[type]),
      document,
    }];
  });
}

export async function adminGetContentDocument(
  type: ContentType,
  id: string,
): Promise<AdminContentDocument | null> {
  if (!writeClient) return null;

  const document = await writeClient.fetch<Record<string, unknown> | null>(
    `*[_id==$id && _type==$type][0]{...}`,
    { id, type },
  );
  if (!document || typeof document._rev !== "string" || typeof document._updatedAt !== "string") return null;

  return {
    id,
    revision: document._rev,
    type,
    updatedAt: document._updatedAt,
    title: contentDocumentTitle(document, CONTENT_TYPE_LABELS[type]),
    document,
  };
}
