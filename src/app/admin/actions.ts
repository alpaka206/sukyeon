"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SanityClient } from "@sanity/client";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminLoginRateLimitKey,
  createSessionToken,
  verifyCredentials,
} from "@/lib/adminAuth";
import { isAdmin } from "@/lib/adminSession";
import {
  SINGLETON_DOCUMENT_IDS,
  contentValidationErrors,
  contentAssetKind,
  isContentType,
  isFormContentType,
  mergeContentFormFields,
  normalizeProductDocumentLinks,
  parseContentForm,
  setContentFormAssetReference,
  type ContentType,
  type ParsedContentForm,
} from "@/lib/adminContent";
import { writeClient } from "@/lib/sanityWrite";
import {
  createAdminLoginRateLimiter,
  type AdminLoginRateLimiter,
} from "@/lib/adminLoginRateLimit";
import type { ContentActionState } from "./content/ContentActionState";

const MAX_ASSET_SIZE_BYTES = 20 * 1024 * 1024;

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

function errorField(message: string): string {
  const submittedField = message.match(/content\.([A-Za-z0-9_.\[\]-]+)/)?.[1];
  if (submittedField) return submittedField.replace(/\[(\d+)\]/g, ".$1");
  const validationField = message.match(/([A-Za-z][A-Za-z0-9_.\[\]-]*)$/)?.[1];
  return validationField?.replace(/\[(\d+)\]/g, ".$1") ?? "form-error-summary";
}

function contentError(message: string, field = errorField(message)): ContentActionState {
  return { errors: [{ field, message }], message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function editableContentFields(document: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(document)) {
    if (!key.startsWith("_")) fields[key] = value;
  }
  return fields;
}

function assignArrayKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((entry) => {
    const mapped = assignArrayKeys(entry);
    if (!isRecord(mapped)) return mapped;
    return typeof mapped._key === "string" && mapped._key ? mapped : { ...mapped, _key: crypto.randomUUID() };
  });
  if (!isRecord(value)) return value;
  const mapped: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) mapped[key] = assignArrayKeys(nested);
  return mapped;
}

function assignContentArrayKeys(fields: Record<string, unknown>): Record<string, unknown> {
  const assigned = assignArrayKeys(fields);
  if (!isRecord(assigned)) throw new Error("Invalid content fields");
  return assigned;
}

async function validateDocumentReferences(client: SanityClient, parsed: ParsedContentForm): Promise<boolean> {
  const references = [...new Set(parsed.documentReferences)];
  if (references.length === 0) return true;
  const found = await client.fetch<readonly string[]>(`*[_id in $references && _type=="doc"]._id`, { references });
  return found.length === references.length;
}

async function collectionKeyExists(client: SanityClient, type: "productLineup" | "productGallery", key: string, id: string): Promise<boolean> {
  return client.fetch<boolean>(`count(*[_type==$type && key==$key && _id!=$id]) > 0`, { type, key, id });
}

function deterministicDocumentId(type: "productLineup" | "productGallery", key: string): string {
  return `${type}-${key}`;
}

function contentListPath(type: ContentType): string {
  return `/admin/content/${type}`;
}

function contentErrorPath(type: ContentType, error: string): string {
  return `${contentListPath(type)}?error=${encodeURIComponent(error)}`;
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

type LegacyDocumentRecord = {
  readonly _id: string;
  readonly _rev: string;
};

const STALE_REVISION_MESSAGE = "다른 수정이 먼저 저장되었습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.";

function legacyListPath(type: "newsPost" | "doc"): string {
  return type === "newsPost" ? "/admin/news" : "/admin/docs";
}

function legacyEditPath(type: "newsPost" | "doc", id: string): string {
  return `${legacyListPath(type)}/${encodeURIComponent(id)}`;
}

function legacyErrorPath(type: "newsPost" | "doc", id: string | null, message: string): string {
  const path = id ? legacyEditPath(type, id) : legacyListPath(type);
  return `${path}?error=${encodeURIComponent(message)}`;
}

async function requireLegacyRevision(
  client: SanityClient,
  type: "newsPost" | "doc",
  id: string,
  submittedRevision: string,
  errorId: string | null = id,
): Promise<LegacyDocumentRecord> {
  const document = await client.fetch<LegacyDocumentRecord | null>(
    `*[_id==$id && _type==$type][0]{_id,_rev}`,
    { id, type },
  );
  if (!document) redirect(legacyListPath(type));
  if (!submittedRevision || submittedRevision !== document._rev) {
    redirect(legacyErrorPath(type, errorId, STALE_REVISION_MESSAGE));
  }
  return document;
}

function isRevisionConflict(error: unknown): boolean {
  return error instanceof Error && /revision|conflict/i.test(error.message);
}

async function safelyCheckLoginRateLimit(limiter: AdminLoginRateLimiter, key: string): Promise<boolean> {
  try {
    return (await limiter.check(key)).kind === "allowed";
  } catch (error) {
    if (error instanceof Error) return false;
    return false;
  }
}

async function safelyRecordFailedLogin(limiter: AdminLoginRateLimiter, key: string): Promise<void> {
  try {
    await limiter.recordFailure(key);
  } catch (error) {
    if (error instanceof Error) return;
  }
}

async function safelyResetLoginRateLimit(limiter: AdminLoginRateLimiter, key: string): Promise<boolean> {
  try {
    await limiter.reset(key);
    return true;
  } catch (error) {
    if (error instanceof Error) return false;
    return false;
  }
}

async function removeUploadedAsset(client: SanityClient, assetId: string): Promise<boolean> {
  try {
    await client.delete(assetId);
    return true;
  } catch (error) {
    if (error instanceof Error) return false;
    return false;
  }
}

type PendingContentAsset = {
  readonly path: string;
  readonly kind: "image" | "file";
  readonly filename: string;
  readonly buffer: Buffer;
  readonly contentType: string;
};

type ContentAssetUploadResult = {
  readonly error: string;
  readonly assetIds: readonly string[];
};

async function prepareContentAssets(type: ContentType, formData: FormData): Promise<{
  readonly assets: readonly PendingContentAsset[];
  readonly error: string;
}> {
  const assets: PendingContentAsset[] = [];
  const paths = new Set<string>();

  for (const [name, raw] of formData.entries()) {
    if (!name.startsWith("asset.")) continue;
    const path = name.slice("asset.".length);
    if (!(raw instanceof File) || (!raw.name && raw.size === 0)) continue;
    if (!raw.name || raw.size === 0) return { assets: [], error: "빈 파일은 업로드할 수 없습니다." };
    if (raw.size > MAX_ASSET_SIZE_BYTES) return { assets: [], error: "파일은 20MB 이하여야 합니다." };
    if (paths.has(path)) return { assets: [], error: "같은 파일 입력이 두 번 전송되었습니다." };

    const kind = contentAssetKind(type, path);
    if (!kind) return { assets: [], error: "허용되지 않은 파일 입력입니다." };
    const buffer = Buffer.from(await raw.arrayBuffer());
    const detectedImageContentType = imageContentType(buffer);
    if (kind === "image" && !detectedImageContentType) return { assets: [], error: "이미지에는 PNG, JPEG, GIF, WEBP 파일만 사용할 수 있습니다." };
    if (kind === "file" && !isPdfBuffer(buffer)) return { assets: [], error: "PDF 파일만 사용할 수 있습니다." };

    paths.add(path);
    assets.push({
      path,
      kind,
      filename: raw.name,
      buffer,
      contentType: detectedImageContentType ?? "application/pdf",
    });
  }

  return { assets, error: "" };
}

async function uploadContentFormAssets(
  client: SanityClient,
  type: ContentType,
  formData: FormData,
  parsed: ParsedContentForm,
): Promise<ContentAssetUploadResult> {
  const prepared = await prepareContentAssets(type, formData);
  if (prepared.error) return { error: prepared.error, assetIds: [] };

  const assetIds: string[] = [];
  try {
    for (const asset of prepared.assets) {
      const uploaded = await client.assets.upload(asset.kind, asset.buffer, {
        filename: asset.filename,
        contentType: asset.contentType,
      });
      assetIds.push(uploaded._id);
      setContentFormAssetReference(parsed.fields, asset.path, asset.kind, uploaded._id);
    }
  } catch {
    const assetsRemoved = await cleanupUploadedAssets(client, assetIds);
    return { error: withCleanupStatus("파일 업로드에 실패했습니다.", assetsRemoved), assetIds: [] };
  }
  return { error: "", assetIds };
}

async function cleanupUploadedAssets(client: SanityClient, assetIds: readonly string[]): Promise<boolean> {
  const results = await Promise.all(assetIds.map((assetId) => removeUploadedAsset(client, assetId)));
  return results.every(Boolean);
}

function withCleanupStatus(message: string, assetsRemoved: boolean): string {
  return assetsRemoved ? message : `${message} 새로 업로드한 파일 정리에 실패했습니다. 관리자에게 문의해 주세요.`;
}

// ---- 인증 --------------------------------------------------------------------

export async function loginAction(formData: FormData) {
  const username = str(formData.get("username"));
  const password = str(formData.get("password"));
  const rateLimitKey = adminLoginRateLimitKey();
  if (!writeClient || !rateLimitKey) redirect("/admin/login?error=1");
  const limiter = createAdminLoginRateLimiter(writeClient);
  const canAttempt = await safelyCheckLoginRateLimit(limiter, rateLimitKey);
  if (!canAttempt) redirect("/admin/login?error=1");
  if (!verifyCredentials(username, password)) {
    await safelyRecordFailedLogin(limiter, rateLimitKey);
    redirect("/admin/login?error=1");
  }
  if (!(await safelyResetLoginRateLimit(limiter, rateLimitKey))) redirect("/admin/login?error=1");
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
  const revision = str(formData.get("_rev"));
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
    const existing = await requireLegacyRevision(client, "newsPost", id, revision);
    try {
      await client.patch(id).ifRevisionId(existing._rev).set(fields).commit();
    } catch (error) {
      if (isRevisionConflict(error)) redirect(legacyErrorPath("newsPost", id, STALE_REVISION_MESSAGE));
      throw error;
    }
  }
  else await client.create({ _type: "newsPost", ...fields });
  revalidateAll();
  redirect("/admin/news");
}

export async function deleteNewsAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const revision = str(formData.get("_rev"));
  if (id) {
    const existing = await requireLegacyRevision(client, "newsPost", id, revision, null);
    try {
      await client.transaction().patch(id, { ifRevisionID: existing._rev }).delete(id).commit();
    } catch (error) {
      if (isRevisionConflict(error)) redirect(legacyErrorPath("newsPost", null, STALE_REVISION_MESSAGE));
      throw error;
    }
  }
  revalidateAll();
  redirect("/admin/news");
}

// ---- 자료실(doc) --------------------------------------------------------------

export async function saveDocAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const revision = str(formData.get("_rev"));
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

  let docId = id;
  if (id) {
    const existing = await requireLegacyRevision(client, "doc", id, revision);
    const file = formData.get("file");
    const uploadedAsset = file instanceof File && file.size > 0 ? await uploadPdf(client, file) : null;
    if (uploadedAsset) fields.file = fileRef(uploadedAsset._id);
    try {
      await client.patch(id).ifRevisionId(existing._rev).set(fields).commit();
    } catch (error) {
      const assetRemoved = uploadedAsset ? await removeUploadedAsset(client, uploadedAsset._id) : true;
      if (isRevisionConflict(error)) {
        const message = assetRemoved
          ? STALE_REVISION_MESSAGE
          : `${STALE_REVISION_MESSAGE} 업로드된 파일 정리에 실패했습니다.`;
        redirect(legacyErrorPath("doc", id, message));
      }
      throw error;
    }
  } else {
    const file = formData.get("file");
    const uploadedAsset = file instanceof File && file.size > 0 ? await uploadPdf(client, file) : null;
    if (uploadedAsset) fields.file = fileRef(uploadedAsset._id);
    try {
      const created = await client.create({ _type: "doc", attachments: [], ...fields });
      docId = created._id;
    } catch (error) {
      if (uploadedAsset) await removeUploadedAsset(client, uploadedAsset._id);
      throw error;
    }
  }
  revalidateAll();
  redirect(`/admin/docs/${docId}`);
}

export async function deleteDocAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const revision = str(formData.get("_rev"));
  if (id) {
    const existing = await requireLegacyRevision(client, "doc", id, revision, null);
    try {
      await client.transaction().patch(id, { ifRevisionID: existing._rev }).delete(id).commit();
    } catch (error) {
      if (isRevisionConflict(error)) redirect(legacyErrorPath("doc", null, STALE_REVISION_MESSAGE));
      throw error;
    }
  }
  revalidateAll();
  redirect("/admin/docs");
}

export async function addAttachmentAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const revision = str(formData.get("_rev"));
  const name = str(formData.get("name")) || "첨부 PDF";
  const file = formData.get("file");
  if (id && file instanceof File && file.size > 0) {
    const existing = await requireLegacyRevision(client, "doc", id, revision);
    const asset = await uploadPdf(client, file);
    try {
      await client
        .patch(id)
        .ifRevisionId(existing._rev)
        .setIfMissing({ attachments: [] })
        .append("attachments", [{ _key: crypto.randomUUID(), name, file: fileRef(asset._id) }])
        .commit();
    } catch (error) {
      const assetRemoved = await removeUploadedAsset(client, asset._id);
      if (isRevisionConflict(error)) {
        const message = assetRemoved
          ? STALE_REVISION_MESSAGE
          : `${STALE_REVISION_MESSAGE} 업로드된 파일 정리에 실패했습니다.`;
        redirect(legacyErrorPath("doc", id, message));
      }
      throw error;
    }
    revalidateAll();
  }
  redirect(`/admin/docs/${id}`);
}

export async function removeAttachmentAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const key = str(formData.get("_key"));
  const revision = str(formData.get("_rev"));
  if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    const existing = await requireLegacyRevision(client, "doc", id, revision);
    try {
      await client.patch(id).ifRevisionId(existing._rev).unset([`attachments[_key=="${key}"]`]).commit();
    } catch (error) {
      if (isRevisionConflict(error)) redirect(legacyErrorPath("doc", id, STALE_REVISION_MESSAGE));
      throw error;
    }
    revalidateAll();
  }
  redirect(`/admin/docs/${id}`);
}

export async function saveContentAction(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const client = await requireAdmin();
  const typeValue = str(formData.get("type"));
  const id = str(formData.get("id"));
  const revision = str(formData.get("revision"));
  if (!isContentType(typeValue) || !isFormContentType(typeValue)) redirect("/admin/content");
  if (formData.has("document")) return contentError("JSON 입력은 허용되지 않습니다.");
  const parsed = parseContentForm(typeValue, formData);
  if (parsed.errors.length > 0) return contentError(parsed.errors[0] ?? "입력을 확인해 주세요.");
  if ((typeValue === "productLineup" || typeValue === "productGallery" || typeValue === "cert") && "order" in parsed.fields) {
    return contentError("정렬 순서는 이동 버튼으로만 변경할 수 있습니다.");
  }
  if (!(await validateDocumentReferences(client, parsed))) return contentError("연결한 자료 문서를 찾을 수 없습니다.");

  const singletonId = SINGLETON_DOCUMENT_IDS[typeValue];
  if (singletonId && id && id !== singletonId) redirect(contentListPath(typeValue));
  const formKey = parsed.fields.key;
  const key = typeof formKey === "string" ? formKey : "";
  if ((typeValue === "productLineup" || typeValue === "productGallery") && !key) return contentError("구분 키를 선택해 주세요.", "key");
  const collectionType = typeValue === "productLineup" || typeValue === "productGallery";
  const suppliedExisting = collectionType && id ? await getContentDocument(client, typeValue, id) : null;
  const requestedId = collectionType
    ? suppliedExisting?._id ?? deterministicDocumentId(typeValue, key)
    : typeValue === "catalog" ? "" : id;
  const activeCatalog = typeValue === "catalog"
    ? await client.fetch<{ readonly _id: string } | null>(`*[_type=="catalog"][0]{_id}`)
    : null;
  const documentId = singletonId || activeCatalog?._id || requestedId || (typeValue === "catalog" ? "catalog-active" : `${typeValue}-${crypto.randomUUID()}`);
  const existing = suppliedExisting ?? await getContentDocument(client, typeValue, documentId);
  if (existing) {
    if (!revision || revision !== existing._rev) return contentError("다른 수정이 저장되었습니다. 입력한 내용은 유지됩니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.");
    if ((typeValue === "productLineup" || typeValue === "productGallery") && key && key !== documentId.replace(`${typeValue}-`, "")) {
      return contentError("생성 후 구분 키는 변경할 수 없습니다.", "key");
    }
    const current = await client.fetch<Record<string, unknown> | null>(`*[_id==$id && _type==$type][0]{...}`, { id: existing._id, type: typeValue });
    const assetUpload = await uploadContentFormAssets(client, typeValue, formData, parsed);
    if (assetUpload.error) return contentError(assetUpload.error);
    const merged = assignContentArrayKeys(mergeContentFormFields(editableContentFields(current ?? {}), parsed.fields));
    if (typeValue === "productLineup") normalizeProductDocumentLinks(merged, parsed.fields);
    const errors = contentValidationErrors(typeValue, merged);
    if (errors.length > 0) {
      const assetsRemoved = await cleanupUploadedAssets(client, assetUpload.assetIds);
      return contentError(withCleanupStatus(errors[0] ?? "입력을 확인해 주세요.", assetsRemoved));
    }
    try {
      await client.patch(existing._id).ifRevisionId(existing._rev).set(merged).unset([...parsed.unset]).commit();
    } catch (error: unknown) {
      const assetsRemoved = await cleanupUploadedAssets(client, assetUpload.assetIds);
      if (error instanceof Error && /revision|conflict/i.test(error.message)) return contentError(withCleanupStatus("다른 수정이 저장되었습니다. 입력한 내용은 유지됩니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.", assetsRemoved));
      throw error;
    }
  } else {
    if (typeValue === "catalog" && activeCatalog) return contentError("활성 카탈로그를 불러오지 못했습니다.");
    if (typeValue === "productLineup" || typeValue === "productGallery") {
      if (await collectionKeyExists(client, typeValue, key, documentId)) return contentError("이미 사용 중인 구분 키입니다.", "key");
    }
    const assetUpload = await uploadContentFormAssets(client, typeValue, formData, parsed);
    if (assetUpload.error) return contentError(assetUpload.error);
    const created = assignContentArrayKeys(parsed.fields);
    if (typeValue === "productLineup" || typeValue === "productGallery" || typeValue === "cert") {
      const nextOrder = await client.fetch<number>(`count(*[_type==$type])`, { type: typeValue });
      created.order = nextOrder;
    }
    const errors = contentValidationErrors(typeValue, created);
    if (errors.length > 0) {
      const assetsRemoved = await cleanupUploadedAssets(client, assetUpload.assetIds);
      return contentError(withCleanupStatus(errors[0] ?? "입력을 확인해 주세요.", assetsRemoved));
    }
    try {
      await client.transaction().create({ _id: documentId, _type: typeValue, ...created }).commit();
    } catch (error: unknown) {
      const assetsRemoved = await cleanupUploadedAssets(client, assetUpload.assetIds);
      if ((typeValue === "productLineup" || typeValue === "productGallery") && error instanceof Error && /already exists|conflict/i.test(error.message)) {
        return contentError(withCleanupStatus("이미 사용 중인 구분 키입니다.", assetsRemoved), "key");
      }
      throw error;
    }
  }
  revalidateAll();
  redirect(contentListPath(typeValue));
}

export async function deleteContentAction(formData: FormData) {
  const client = await requireAdmin();
  const typeValue = str(formData.get("type"));
  const id = str(formData.get("id"));
  const revision = str(formData.get("revision"));
  if (!isContentType(typeValue) || !id) redirect("/admin/content");
  if (SINGLETON_DOCUMENT_IDS[typeValue] || typeValue === "catalog") redirect(contentListPath(typeValue));

  const existing = await getContentDocument(client, typeValue, id);
  if (!existing) redirect(contentListPath(typeValue));
  if (!revision || revision !== existing._rev) redirect(contentErrorPath(typeValue, "다른 수정이 저장되었습니다. 새로고침 후 다시 시도해 주세요."));
  try {
    await client.transaction().patch(existing._id, { ifRevisionID: existing._rev }).delete(existing._id).commit();
  } catch (error: unknown) {
    if (error instanceof Error && /revision|conflict/i.test(error.message)) redirect(contentErrorPath(typeValue, "다른 수정이 저장되었습니다. 새로고침 후 다시 시도해 주세요."));
    throw error;
  }
  revalidateAll();
  redirect(contentListPath(typeValue));
}
