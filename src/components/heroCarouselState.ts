export const HERO_CAROUSEL_AUTOPLAY_MS = 4000;
export const HERO_CAROUSEL_FADE_MS = 700;

export function nextSlideIndex(active: number, slideCount: number): number {
  return slideCount > 0 ? (active + 1) % slideCount : 0;
}

export function previousSlideIndex(active: number, slideCount: number): number {
  return slideCount > 0 ? (active - 1 + slideCount) % slideCount : 0;
}

export function shouldAutoplaySlides(slideCount: number, paused: boolean): boolean {
  return slideCount > 1 && !paused;
}

export function optimizedSanitySource(
  source: string,
  width: number,
  quality = 70,
  format: "auto" | "webp" = "auto",
): string {
  if (!source.startsWith("https://cdn.sanity.io/")) {
    return source;
  }
  const separator = source.includes("?") ? "&" : "?";
  const formatQuery = format === "webp" ? "fm=webp" : "auto=format";
  return `${source}${separator}w=${width}&q=${quality}&${formatQuery}`;
}
