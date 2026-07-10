"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SanityClient } from "@sanity/client";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifyCredentials,
} from "@/lib/adminAuth";
import { isAdmin } from "@/lib/adminSession";
import { SINGLETON_DOCUMENT_IDS, isContentType, type ContentType } from "@/lib/adminContent";
import { writeClient } from "@/lib/sanityWrite";

const MAX_ASSET_SIZE_BYTES = 20 * 1024 * 1024;
const URL_FIELDS = new Set([
  "href",
  "url",
  "blog",
  "primaryHref",
  "secondaryHref",
  "moreHref",
  "phoneHref",
]);

// ---- helpers (모듈 내부 전용, 서버 액션 아님) --------------------------------

async function requireAdmin(): Promise<SanityClient> {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!writeClient) {
    throw new Error("Sanity 쓰기 토큰(SANITY_API_WRITE_TOKEN)이 설정되지 않았습니다.");
  }
  return writeClient;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${crypto.randomUUID().slice(0, 8)}`;
}

function slugField(value: string, source: string) {
  return { _type: "slug", current: value || slugify(source) };
}

function parseBody(v: FormDataEntryValue | null): string[] {
  const s = String(v ?? "").replace(/\r\n/g, "\n").trim();
  if (!s) return [];
  return s
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

async function uploadPdf(client: SanityClient, file: File) {
  if (file.size > MAX_ASSET_SIZE_BYTES) throw new Error("PDF 파일은 20MB 이하여야 합니다.");
  const buf = Buffer.from(await file.arrayBuffer());
  if (!isPdfBuffer(buf)) throw new Error("유효한 PDF 파일만 업로드할 수 있습니다.");
  return client.assets.upload("file", buf, {
    filename: file.name,
    contentType: "application/pdf",
  });
}

function fileRef(assetId: string) {
  return { _type: "file", asset: { _type: "reference", _ref: assetId } };
}

function revalidateAll() {
  for (const p of ["/", "/news", "/data", "/catalog", "/cert", "/about", "/products", "/admin/news", "/admin/docs", "/admin/content"]) {
    revalidatePath(p);
  }
  revalidatePath("/news/[slug]", "page");
  revalidatePath("/data/[slug]", "page");
}

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

function imageContentType(buffer: Buffer): string | null {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return "image/jpeg";
  if (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a") return "image/gif";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

function isSafeUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!/^[a-z][a-z0-9+.-]*:/i.test(normalized)) return true;
  return normalized.startsWith("https://") || normalized.startsWith("http://") || normalized.startsWith("mailto:") || normalized.startsWith("tel:");
}

function hasOnlySafeUrls(value: unknown, fieldName = ""): boolean {
  if (typeof value === "string") return !URL_FIELDS.has(fieldName) || isSafeUrl(value);
  if (Array.isArray(value)) return value.every((entry) => hasOnlySafeUrls(entry));
  if (!value || typeof value !== "object") return true;
  return Object.entries(value).every(([key, entry]) => hasOnlySafeUrls(entry, key));
}

function parseContentDocument(value: FormDataEntryValue | null): Record<string, unknown> | null {
  if (typeof value !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const document: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(parsed)) {
      if (!key.startsWith("_")) document[key] = field;
    }
    return document;
  } catch {
    return null;
  }
}

function contentListPath(type: ContentType): string {
  return `/admin/content/${type}`;
}

type ContentDocumentRecord = {
  readonly _id: string;
  readonly _rev: string;
};

async function getContentDocument(client: SanityClient, type: ContentType, id: string): Promise<ContentDocumentRecord | null> {
  return client.fetch<ContentDocumentRecord | null>(
    `*[_id==$id && _type==$type][0]{_id,_rev}`,
    { id, type },
  );
}

async function requireDocumentType(client: SanityClient, type: "newsPost" | "doc", id: string): Promise<void> {
  const document = await client.fetch<{ readonly _id: string } | null>(
    `*[_id==$id && _type==$type][0]{_id}`,
    { id, type },
  );
  if (!document) redirect(`/admin/${type === "newsPost" ? "news" : "docs"}`);
}

// ---- 인증 --------------------------------------------------------------------

export async function loginAction(formData: FormData) {
  const username = str(formData.get("username"));
  const password = str(formData.get("password"));
  if (!verifyCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---- 공지사항(newsPost) -------------------------------------------------------

export async function saveNewsAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const title = str(formData.get("title"));
  const fields = {
    title,
    category: str(formData.get("category")) || "일반",
    date: str(formData.get("date")),
    accent: formData.get("accent") === "on",
    slug: slugField(str(formData.get("slug")), title),
    summary: str(formData.get("summary")),
    body: parseBody(formData.get("body")),
  };
  if (id) {
    await requireDocumentType(client, "newsPost", id);
    await client.patch(id).set(fields).commit();
  }
  else await client.create({ _type: "newsPost", ...fields });
  revalidateAll();
  redirect("/admin/news");
}

export async function deleteNewsAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  if (id) {
    await requireDocumentType(client, "newsPost", id);
    await client.delete(id);
  }
  revalidateAll();
  redirect("/admin/news");
}

// ---- 자료실(doc) --------------------------------------------------------------

export async function saveDocAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const name = str(formData.get("name"));
  const fields: Record<string, unknown> = {
    name,
    category: str(formData.get("category")),
    date: str(formData.get("date")),
    notice: formData.get("notice") === "on",
    slug: slugField(str(formData.get("slug")), name),
    summary: str(formData.get("summary")),
    body: parseBody(formData.get("body")),
  };

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const asset = await uploadPdf(client, file);
    fields.file = fileRef(asset._id);
  }

  let docId = id;
  if (id) {
    await requireDocumentType(client, "doc", id);
    await client.patch(id).set(fields).commit();
  } else {
    const created = await client.create({ _type: "doc", attachments: [], ...fields });
    docId = created._id;
  }
  revalidateAll();
  redirect(`/admin/docs/${docId}`);
}

export async function deleteDocAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  if (id) {
    await requireDocumentType(client, "doc", id);
    await client.delete(id);
  }
  revalidateAll();
  redirect("/admin/docs");
}

export async function addAttachmentAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const name = str(formData.get("name")) || "첨부 PDF";
  const file = formData.get("file");
  if (id && file instanceof File && file.size > 0) {
    await requireDocumentType(client, "doc", id);
    const asset = await uploadPdf(client, file);
    await client
      .patch(id)
      .setIfMissing({ attachments: [] })
      .append("attachments", [{ _key: crypto.randomUUID(), name, file: fileRef(asset._id) }])
      .commit();
    revalidateAll();
  }
  redirect(`/admin/docs/${id}`);
}

export async function removeAttachmentAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const key = str(formData.get("_key"));
  if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    await requireDocumentType(client, "doc", id);
    await client.patch(id).unset([`attachments[_key=="${key}"]`]).commit();
    revalidateAll();
  }
  redirect(`/admin/docs/${id}`);
}

export async function saveContentAction(formData: FormData) {
  const client = await requireAdmin();
  const typeValue = str(formData.get("type"));
  const id = str(formData.get("id"));
  const revision = str(formData.get("revision"));
  const document = parseContentDocument(formData.get("document"));

  if (!isContentType(typeValue) || !document || !hasOnlySafeUrls(document)) redirect("/admin/content");

  const singletonId = SINGLETON_DOCUMENT_IDS[typeValue];
  if (singletonId && id && id !== singletonId) redirect(contentListPath(typeValue));

  const documentId = singletonId || id || `${typeValue}-${crypto.randomUUID()}`;
  const existing = await getContentDocument(client, typeValue, documentId);
  if (existing) {
    if (!revision || revision !== existing._rev) redirect(contentListPath(typeValue));
    const existingFields = await client.fetch<Record<string, unknown>>(`*[_id==$id][0]{...}`, { id: documentId });
    const fieldsToUnset = Object.keys(existingFields ?? {}).filter((key) => !key.startsWith("_") && !(key in document));
    await client.patch(existing._id).ifRevisionId(existing._rev).set(document).unset(fieldsToUnset).commit();
  } else {
    await client.create({ _id: documentId, _type: typeValue, ...document });
  }
  revalidateAll();
  redirect(contentListPath(typeValue));
}

export async function deleteContentAction(formData: FormData) {
  const client = await requireAdmin();
  const typeValue = str(formData.get("type"));
  const id = str(formData.get("id"));
  if (!isContentType(typeValue) || !id) redirect("/admin/content");
  if (SINGLETON_DOCUMENT_IDS[typeValue]) redirect(contentListPath(typeValue));

  const existing = await getContentDocument(client, typeValue, id);
  if (!existing) redirect(contentListPath(typeValue));
  await client.delete(existing._id);
  revalidateAll();
  redirect(contentListPath(typeValue));
}

type AssetUploadState = {
  readonly error: string;
  readonly reference: string;
};

export async function uploadContentAssetAction(
  _previousState: AssetUploadState,
  formData: FormData,
): Promise<AssetUploadState> {
  const client = await requireAdmin();
  const typeValue = str(formData.get("type"));
  const file = formData.get("asset");
  if (!isContentType(typeValue) || !(file instanceof File) || file.size === 0) {
    return { error: "업로드할 파일을 선택하세요.", reference: "" };
  }
  if (file.size > MAX_ASSET_SIZE_BYTES) return { error: "파일은 20MB 이하여야 합니다.", reference: "" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedImageContentType = imageContentType(buffer);
  const isImage = Boolean(detectedImageContentType);
  const isPdf = isPdfBuffer(buffer);
  if (!isImage && !isPdf) return { error: "유효한 이미지 또는 PDF 파일만 업로드할 수 있습니다.", reference: "" };
  const asset = await client.assets.upload(isImage ? "image" : "file", buffer, {
    filename: file.name,
    contentType: detectedImageContentType ?? "application/pdf",
  });
  const reference = isImage
    ? { _type: "image", asset: { _type: "reference", _ref: asset._id } }
    : { _type: "file", asset: { _type: "reference", _ref: asset._id } };

  return { error: "", reference: JSON.stringify(reference, null, 2) };
}
