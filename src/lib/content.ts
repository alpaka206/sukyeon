import { sanityClient } from "./sanity";
import newsJson from "@/content/news.json";
import docsJson from "@/content/docs.json";
import catalogJson from "@/content/catalog.json";
import certsJson from "@/content/certs.json";

// 콘텐츠 어댑터: Sanity가 설정돼 있고 데이터가 있으면 Sanity, 아니면 로컬 JSON(src/content/*).
// 두 경로 모두 아래 타입과 동일한 형태를 반환하므로 페이지 코드는 출처를 신경 쓸 필요가 없다.

export type NewsItem = { category: string; title: string; date: string; accent: boolean };
export type DocItem = { name: string; category: string; date: string; file: string };
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

const NEWS_Q = `*[_type=="newsPost"]|order(date desc){category,title,date,accent}`;
const DOCS_Q = `*[_type=="doc"]|order(date desc){name,category,date,"file":coalesce(file.asset->url,"")}`;
const CATALOG_Q = `*[_type=="catalog"]|order(_updatedAt desc)[0]{title,tagline,"file":coalesce(file.asset->url,"")}`;
const CERTS_Q = `*[_type=="cert"]|order(order asc){eyebrow,title,standard,desc,issuer,number,scope,validity,"imageKo":coalesce(imageKo.asset->url,""),"imageEn":coalesce(imageEn.asset->url,"")}`;

export async function getNews(): Promise<NewsItem[]> {
  if (sanityClient) {
    const r = await sanityClient.fetch<NewsItem[]>(NEWS_Q);
    if (r?.length) return r;
  }
  return newsJson.items as NewsItem[];
}

export async function getDocs(): Promise<DocItem[]> {
  if (sanityClient) {
    const r = await sanityClient.fetch<DocItem[]>(DOCS_Q);
    if (r?.length) return r;
  }
  return docsJson.items as DocItem[];
}

export async function getCatalog(): Promise<Catalog> {
  if (sanityClient) {
    const r = await sanityClient.fetch<Catalog | null>(CATALOG_Q);
    if (r?.file) return r;
  }
  return catalogJson as Catalog;
}

export async function getCerts(): Promise<CertItem[]> {
  if (sanityClient) {
    const r = await sanityClient.fetch<CertItem[]>(CERTS_Q);
    if (r?.length) return r;
  }
  return certsJson.items as CertItem[];
}
