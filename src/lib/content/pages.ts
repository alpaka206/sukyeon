import { configuredRequest, type ContentRequest } from "./client";
import type { AboutPage, HomePage, SiteSettings } from "./types";

const HOME_Q = `*[_type=="homePage"][0]{
  hero{titleLine1,titleLine2,copyLine1,copyLine2,primaryLabel,primaryHref,secondaryLabel,secondaryHref,slides[]{"desktop":desktopImage.asset->url,"mobile":mobileImage.asset->url,alt}},
  productsHeading,
  productCards[]{"image":image.asset->url,title,tag,desc,href},
  productsCta,
  whyHeading,
  whyItems[]{icon,title,desc},
  contactCta
}`;
const SETTINGS_Q = `*[_type=="siteSettings"][0]{"logo":logo.asset->url,company,nav[]{label,href,children[]{label,href}},footerTagline,footerColumns[]{title,links[]{label,href}}}`;
const ABOUT_Q = `*[_type=="aboutPage"][0]{
  greeting{heading,paragraphs,signName,signLabel,"image":image.asset->url},
  info{heading,paragraphs,"image":image.asset->url,values[]{no,title,desc}},
  equipment{desc,rows[]{no,name,cap}},
  history{desc,entries[]{year,lines}},
  location{mapNote}
}`;

export async function readHomePage(request: ContentRequest<HomePage | null> | null): Promise<HomePage | null> {
  if (!request) return null;
  return (await request(HOME_Q)) ?? null;
}

export async function getHomePage(): Promise<HomePage | null> {
  return readHomePage(configuredRequest());
}

export async function readSiteSettings(
  request: ContentRequest<SiteSettings | null> | null,
): Promise<SiteSettings | null> {
  if (!request) return null;
  return (await request(SETTINGS_Q)) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return readSiteSettings(configuredRequest());
}

export async function readAboutPage(request: ContentRequest<AboutPage | null> | null): Promise<AboutPage | null> {
  if (!request) return null;
  return (await request(ABOUT_Q)) ?? null;
}

export async function getAboutPage(): Promise<AboutPage | null> {
  return readAboutPage(configuredRequest());
}
