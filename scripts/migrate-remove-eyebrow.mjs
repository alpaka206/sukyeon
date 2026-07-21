// 일회성 마이그레이션: 사이트에서 제거된 영문 라벨(eyebrow) 필드를 기존 문서에서 정리한다.
// 실행: node scripts/migrate-remove-eyebrow.mjs  (SANITY_API_WRITE_TOKEN 필요, 실제 데이터 수정)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const ROOT = process.cwd();
const env = {};
for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !l.trim().startsWith("#")) env[m[1]] = m[2].trim();
}

if (!env.SANITY_API_WRITE_TOKEN) {
  console.error("SANITY_API_WRITE_TOKEN이 .env.local에 없습니다.");
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const flat = await client.fetch(
  `*[_type in ["cert","productLineup","productGallery"] && defined(eyebrow)]._id`,
);
const home = await client.fetch(
  `*[_type=="homePage" && (defined(productsHeading.eyebrow) || defined(whyHeading.eyebrow))]._id`,
);

if (flat.length === 0 && home.length === 0) {
  console.log("정리할 eyebrow 필드가 없습니다.");
  process.exit(0);
}

let transaction = client.transaction();
for (const id of flat) transaction = transaction.patch(id, (p) => p.unset(["eyebrow"]));
for (const id of home) {
  transaction = transaction.patch(id, (p) => p.unset(["productsHeading.eyebrow", "whyHeading.eyebrow"]));
}
await transaction.commit();
console.log(`정리 완료: ${flat.length + home.length}개 문서에서 eyebrow 필드를 제거했습니다.`);
