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
import { writeClient } from "@/lib/sanityWrite";

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
  const buf = Buffer.from(await file.arrayBuffer());
  return client.assets.upload("file", buf, {
    filename: file.name,
    contentType: file.type || "application/pdf",
  });
}

function fileRef(assetId: string) {
  return { _type: "file", asset: { _type: "reference", _ref: assetId } };
}

function revalidateAll() {
  for (const p of ["/", "/news", "/data", "/catalog", "/admin/news", "/admin/docs"]) {
    revalidatePath(p);
  }
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
  if (id) await client.patch(id).set(fields).commit();
  else await client.create({ _type: "newsPost", ...fields });
  revalidateAll();
  redirect("/admin/news");
}

export async function deleteNewsAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  if (id) await client.delete(id);
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
  if (id) await client.delete(id);
  revalidateAll();
  redirect("/admin/docs");
}

export async function addAttachmentAction(formData: FormData) {
  const client = await requireAdmin();
  const id = str(formData.get("_id"));
  const name = str(formData.get("name")) || "첨부 PDF";
  const file = formData.get("file");
  if (id && file instanceof File && file.size > 0) {
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
  if (id && key) {
    await client.patch(id).unset([`attachments[_key=="${key}"]`]).commit();
    revalidateAll();
  }
  redirect(`/admin/docs/${id}`);
}
