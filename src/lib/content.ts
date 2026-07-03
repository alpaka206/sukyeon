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

// ─────────────────────────────────────────────────────────────
// 제품소개 (라인업 = 이형제·프란자오일, 갤러리 = 사출·스프레이·용탕)
// ─────────────────────────────────────────────────────────────
export type ProductDoc = { readonly label: string; readonly href: string };
export type LineupItem = {
  readonly code: string;
  readonly image: string;
  readonly summary: string;
  readonly points: readonly string[];
  readonly documents: readonly ProductDoc[];
};
export type ProductLineup = {
  readonly key: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly brand: string;
  readonly intro: string;
  readonly bullets: readonly string[];
  readonly items: readonly LineupItem[];
};
export type GalleryProduct = {
  readonly image: string;
  readonly title: string;
  readonly summary: string;
};
export type ProductGallery = {
  readonly key: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly items: readonly GalleryProduct[];
};

const LINEUPS_Q = `*[_type=="productLineup"]|order(order asc){key,eyebrow,title,brand,intro,bullets,items[]{code,"image":image.asset->url,summary,points,documents[]{label,href}}}`;
const GALLERIES_Q = `*[_type=="productGallery"]|order(order asc){key,eyebrow,title,intro,items[]{"image":image.asset->url,title,summary}}`;

export async function getProductLineups(): Promise<ProductLineup[]> {
  if (!sanityClient) return [];
  try {
    const r = await sanityClient.fetch<ProductLineup[]>(LINEUPS_Q);
    return r ?? [];
  } catch (e) {
    console.error("[content] Sanity 제품 라인업 조회 실패:", e);
    return [];
  }
}

export async function getProductGalleries(): Promise<ProductGallery[]> {
  if (!sanityClient) return [];
  try {
    const r = await sanityClient.fetch<ProductGallery[]>(GALLERIES_Q);
    return r ?? [];
  } catch (e) {
    console.error("[content] Sanity 제품 갤러리 조회 실패:", e);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// 홈 화면
// ─────────────────────────────────────────────────────────────
export type HeroSlide = { readonly desktop: string; readonly mobile: string; readonly alt: string };
export type HomeCard = { readonly image: string; readonly title: string; readonly tag: string; readonly desc: string; readonly href: string };
export type HomeWhy = { readonly icon: string; readonly title: string; readonly desc: string };
export type HomePage = {
  readonly hero: {
    readonly titleLine1: string; readonly titleLine2: string;
    readonly copyLine1: string; readonly copyLine2: string;
    readonly primaryLabel: string; readonly primaryHref: string;
    readonly secondaryLabel: string; readonly secondaryHref: string;
    readonly slides: readonly HeroSlide[];
  };
  readonly productsHeading: { readonly eyebrow: string; readonly title: string; readonly moreLabel: string; readonly moreHref: string };
  readonly productCards: readonly HomeCard[];
  readonly productsCta: { readonly title: string; readonly desc: string; readonly label: string; readonly href: string };
  readonly whyHeading: { readonly eyebrow: string; readonly title: string };
  readonly whyItems: readonly HomeWhy[];
  readonly contactCta: {
    readonly title: string; readonly desc: string;
    readonly primaryLabel: string; readonly primaryHref: string;
    readonly phoneLabel: string; readonly phoneHref: string;
  };
};

const HOME_Q = `*[_type=="homePage"][0]{
  hero{titleLine1,titleLine2,copyLine1,copyLine2,primaryLabel,primaryHref,secondaryLabel,secondaryHref,slides[]{"desktop":desktopImage.asset->url,"mobile":mobileImage.asset->url,alt}},
  productsHeading,
  productCards[]{"image":image.asset->url,title,tag,desc,href},
  productsCta,
  whyHeading,
  whyItems[]{icon,title,desc},
  contactCta
}`;

export async function getHomePage(): Promise<HomePage | null> {
  if (!sanityClient) return null;
  try {
    return (await sanityClient.fetch<HomePage | null>(HOME_Q)) ?? null;
  } catch (e) {
    console.error("[content] Sanity 홈 조회 실패:", e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 사이트 설정 (회사정보·메뉴·푸터)
// ─────────────────────────────────────────────────────────────
export type NavChild = { readonly label: string; readonly href: string };
export type NavItem = { readonly label: string; readonly href: string; readonly children?: readonly NavChild[] };
export type FooterLink = { readonly label: string; readonly href: string };
export type FooterColumn = { readonly title: string; readonly links: readonly FooterLink[] };
export type Company = {
  readonly name: string; readonly nameEn: string; readonly ceo: string; readonly address: string;
  readonly tel: string; readonly fax: string; readonly email: string; readonly bizNo: string;
  readonly hours: string; readonly blog: string;
};
export type SiteSettings = {
  readonly logo: string;
  readonly company: Company;
  readonly nav: readonly NavItem[];
  readonly footerTagline: string;
  readonly footerColumns: readonly FooterColumn[];
};

const SETTINGS_Q = `*[_type=="siteSettings"][0]{"logo":logo.asset->url,company,nav[]{label,href,children[]{label,href}},footerTagline,footerColumns[]{title,links[]{label,href}}}`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return null;
  try {
    return (await sanityClient.fetch<SiteSettings | null>(SETTINGS_Q)) ?? null;
  } catch (e) {
    console.error("[content] Sanity 사이트설정 조회 실패:", e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 회사소개
// ─────────────────────────────────────────────────────────────
export type AboutValue = { readonly no: string; readonly title: string; readonly desc: string };
export type EquipRow = { readonly no: string; readonly name: string; readonly cap: string };
export type HistoryEntry = { readonly year: string; readonly lines: readonly string[] };
export type AboutPage = {
  readonly greeting: { readonly heading: string; readonly paragraphs: readonly string[]; readonly signName: string; readonly signLabel: string; readonly image: string };
  readonly info: { readonly heading: string; readonly paragraphs: readonly string[]; readonly image: string; readonly values: readonly AboutValue[] };
  readonly equipment: { readonly desc: string; readonly rows: readonly EquipRow[] };
  readonly history: { readonly desc: string; readonly entries: readonly HistoryEntry[] };
  readonly location: { readonly mapNote: string };
};

const ABOUT_Q = `*[_type=="aboutPage"][0]{
  greeting{heading,paragraphs,signName,signLabel,"image":image.asset->url},
  info{heading,paragraphs,"image":image.asset->url,values[]{no,title,desc}},
  equipment{desc,rows[]{no,name,cap}},
  history{desc,entries[]{year,lines}},
  location{mapNote}
}`;

export async function getAboutPage(): Promise<AboutPage | null> {
  if (!sanityClient) return null;
  try {
    return (await sanityClient.fetch<AboutPage | null>(ABOUT_Q)) ?? null;
  } catch (e) {
    console.error("[content] Sanity 회사소개 조회 실패:", e);
    return null;
  }
}
