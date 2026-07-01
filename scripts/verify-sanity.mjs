// Sanity 공개 읽기(토큰 없이, CDN) 검증 — 실제 사이트와 동일 경로.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const ROOT = process.cwd();
const env = {};
for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !l.trim().startsWith("#")) env[m[1]] = m[2].trim();
}

const pub = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const counts = await pub.fetch(
  `{"공지":count(*[_type=="newsPost"]),"자료":count(*[_type=="doc"]),"카탈로그":count(*[_type=="catalog"]),"인증":count(*[_type=="cert"])}`,
);
console.log("토큰 없이 공개 읽기 카운트:", counts);

const sample = await pub.fetch(
  `*[_type=="doc" && defined(file.asset)][0]{name,"file":file.asset->url,"첨부수":count(attachments)}`,
);
console.log("샘플 자료:", sample);

const cert = await pub.fetch(`*[_type=="cert"][0]{title,"이미지":imageKo.asset->url}`);
console.log("샘플 인증:", cert);
