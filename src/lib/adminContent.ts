import "server-only";

import { writeClient } from "./sanityWrite";
import { CONTENT_TYPE_LABELS, contentDocumentTitle, type ContentType } from "./adminContentForm";

// 폼 파싱·병합·검증 로직은 순수 모듈(adminContentForm.ts)에 있고 여기서 재노출한다.
// 이 파일은 Sanity 조회가 필요한 server-only 진입점만 갖는다.
export * from "./adminContentForm";

export type AdminContentDocument = {
  readonly id: string;
  readonly revision: string;
  readonly type: ContentType;
  readonly updatedAt: string;
  readonly title: string;
  readonly document: Record<string, unknown>;
};

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
