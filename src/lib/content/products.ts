import { configuredRequest, type ContentRequest } from "./client";
import type { ProductGallery, ProductLineup } from "./types";

const LINEUPS_Q = `*[_type=="productLineup"]|order(order asc){key,eyebrow,title,brand,intro,bullets,"items":items[visible != false]{code,"image":image.asset->url,summary,points,documents[]{"label":coalesce(label,doc->name),"url":coalesce(doc->file.asset->url,href)}}}`;
const GALLERIES_Q = `*[_type=="productGallery"]|order(order asc){key,eyebrow,title,intro,"items":items[visible != false]{"image":image.asset->url,title,summary}}`;

export async function readProductLineups(
  request: ContentRequest<readonly ProductLineup[] | null> | null,
): Promise<ProductLineup[]> {
  if (!request) return [];
  return [...((await request(LINEUPS_Q)) ?? [])];
}

export async function getProductLineups(): Promise<ProductLineup[]> {
  return readProductLineups(configuredRequest());
}

export async function readProductGalleries(
  request: ContentRequest<readonly ProductGallery[] | null> | null,
): Promise<ProductGallery[]> {
  if (!request) return [];
  return [...((await request(GALLERIES_Q)) ?? [])];
}

export async function getProductGalleries(): Promise<ProductGallery[]> {
  return readProductGalleries(configuredRequest());
}
