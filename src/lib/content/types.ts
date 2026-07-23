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

export type CertItem = {
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

export type ProductDoc = { readonly label: string; readonly url: string };
export type LineupItem = {
  readonly code: string;
  readonly image: string;
  readonly summary: string;
  readonly points: readonly string[];
  readonly documents: readonly ProductDoc[];
};
export type ProductLineup = {
  readonly key: string;
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
  readonly title: string;
  readonly intro: string;
  readonly items: readonly GalleryProduct[];
};

export type HeroSlide = { readonly desktop: string; readonly mobile: string; readonly alt: string };
export type HomeCard = {
  readonly image: string;
  readonly title: string;
  readonly tag: string;
  readonly desc: string;
  readonly href: string;
};
export type HomeWhy = { readonly icon: string; readonly title: string; readonly desc: string };
export type HomePage = {
  readonly hero: {
    readonly titleLine1: string;
    readonly titleLine2: string;
    readonly copyLine1: string;
    readonly copyLine2: string;
    readonly primaryLabel: string;
    readonly primaryHref: string;
    readonly secondaryLabel: string;
    readonly secondaryHref: string;
    readonly slides: readonly HeroSlide[];
  };
  readonly productsHeading: {
    readonly title: string;
    readonly moreLabel: string;
    readonly moreHref: string;
  };
  readonly productCards: readonly HomeCard[];
  readonly productsCta: { readonly title: string; readonly desc: string; readonly label: string; readonly href: string };
  readonly whyHeading: { readonly title: string };
  readonly whyItems: readonly HomeWhy[];
  readonly contactCta: {
    readonly title: string;
    readonly desc: string;
    readonly primaryLabel: string;
    readonly primaryHref: string;
    readonly phoneLabel: string;
    readonly phoneHref: string;
  };
};

export type NavChild = { readonly label: string; readonly href: string };
export type NavItem = { readonly label: string; readonly href: string; readonly children?: readonly NavChild[] };
export type FooterLink = { readonly label: string; readonly href: string };
export type FooterColumn = { readonly title: string; readonly links: readonly FooterLink[] };
export type Company = {
  readonly name: string;
  readonly nameEn: string;
  readonly ceo: string;
  readonly address: string;
  readonly tel: string;
  readonly fax: string;
  readonly email: string;
  readonly bizNo: string;
  readonly hours: string;
  readonly blog: string;
};
export type SiteSettings = {
  readonly logo: string;
  readonly company: Company;
  readonly nav: readonly NavItem[];
  readonly footerTagline: string;
  readonly footerColumns: readonly FooterColumn[];
};

export type AboutValue = { readonly no: string; readonly title: string; readonly desc: string };
export type EquipRow = { readonly no: string; readonly name: string; readonly cap: string };
export type HistoryEntry = { readonly year: string; readonly lines: readonly string[] };
export type AboutPage = {
  readonly greeting: {
    readonly heading: string;
    readonly paragraphs: readonly string[];
    readonly signName: string;
    readonly signLabel: string;
    readonly image: string;
  };
  readonly info: {
    readonly heading: string;
    readonly paragraphs: readonly string[];
    readonly image: string;
    readonly values: readonly AboutValue[];
  };
  readonly equipment: { readonly desc: string; readonly rows: readonly EquipRow[] };
  readonly history: { readonly desc: string; readonly entries: readonly HistoryEntry[] };
  readonly location: { readonly mapNote: string };
};
