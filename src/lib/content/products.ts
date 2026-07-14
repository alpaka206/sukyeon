import { configuredRequest, type ContentRequest } from "./client";
import type {
  GalleryProduct,
  ProductDoc,
  ProductGallery,
  ProductLineup,
} from "./types";

const LINEUPS_Q = `*[_type=="productLineup"]|order(order asc){key,eyebrow,title,brand,intro,bullets,"items":items[visible != false]{code,"image":image.asset->url,summary,points,documents[]{"label":coalesce(label,doc->name),"url":coalesce(doc->file.asset->url,href)}}}`;
const GALLERIES_Q = `*[_type=="productGallery"]|order(order asc){key,eyebrow,title,intro,"items":items[visible != false]{"image":image.asset->url,title,summary}}`;

export async function readProductLineups(
  request: ContentRequest<readonly unknown[] | null> | null,
): Promise<ProductLineup[]> {
  if (!request) return [];
  return ((await request(LINEUPS_Q)) ?? []).map(productLineup);
}

export async function getProductLineups(): Promise<ProductLineup[]> {
  return readProductLineups(configuredRequest());
}

export async function readProductGalleries(
  request: ContentRequest<readonly unknown[] | null> | null,
): Promise<ProductGallery[]> {
  if (!request) return [];
  return ((await request(GALLERIES_Q)) ?? []).map(productGallery);
}

export async function getProductGalleries(): Promise<ProductGallery[]> {
  return readProductGalleries(configuredRequest());
}

type ContentRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ContentRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function objectAt(value: unknown): ContentRecord {
  return isRecord(value) ? value : {};
}

function stringAt(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function textItems(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string") return [item];
    const text = stringAt(objectAt(item).item);
    return text ? [text] : [];
  });
}

function documents(value: unknown): readonly ProductDoc[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const document = objectAt(item);
    return {
      label: stringAt(document.label),
      url: stringAt(document.url),
    };
  });
}

function lineupItems(value: unknown): ProductLineup["items"] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const product = objectAt(item);
    return {
      code: stringAt(product.code),
      image: stringAt(product.image),
      summary: stringAt(product.summary),
      points: textItems(product.points),
      documents: documents(product.documents),
    };
  });
}

function galleryItems(value: unknown): readonly GalleryProduct[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const product = objectAt(item);
    return {
      image: stringAt(product.image),
      title: stringAt(product.title),
      summary: stringAt(product.summary),
    };
  });
}

function productLineup(value: unknown): ProductLineup {
  const lineup = objectAt(value);
  return {
    key: stringAt(lineup.key),
    eyebrow: stringAt(lineup.eyebrow),
    title: stringAt(lineup.title),
    brand: stringAt(lineup.brand),
    intro: stringAt(lineup.intro),
    bullets: textItems(lineup.bullets),
    items: lineupItems(lineup.items),
  };
}

function productGallery(value: unknown): ProductGallery {
  const gallery = objectAt(value);
  return {
    key: stringAt(gallery.key),
    eyebrow: stringAt(gallery.eyebrow),
    title: stringAt(gallery.title),
    intro: stringAt(gallery.intro),
    items: galleryItems(gallery.items),
  };
}
