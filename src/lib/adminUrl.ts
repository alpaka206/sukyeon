const ASCII_CONTROL_OR_WHITESPACE = /[\u0000-\u0020\u007f]/;
const ENCODED_PATH_SEPARATOR = /%(?:2f|5c)/i;
const SAFE_ABSOLUTE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function normalizeContentUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return "";
  if (ASCII_CONTROL_OR_WHITESPACE.test(value) || value.includes("\\")) return null;

  if (value.startsWith("/")) {
    if (value.startsWith("//") || ENCODED_PATH_SEPARATOR.test(value)) return null;
    return value;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch (error: unknown) {
    if (error instanceof TypeError) return null;
    throw error;
  }

  if (!SAFE_ABSOLUTE_PROTOCOLS.has(url.protocol)) return null;
  if ((url.protocol === "http:" || url.protocol === "https:") && (!url.hostname || !/^https?:\/\//i.test(value))) return null;
  if ((url.protocol === "mailto:" || url.protocol === "tel:") && !url.pathname) return null;
  return url.href;
}

export function safeContentHref(input: unknown, fallback = "#"): string {
  if (typeof input !== "string") return fallback;
  return normalizeContentUrl(input) || fallback;
}

const SANITY_FILE_URL = /^https:\/\/cdn\.sanity\.io\/files\//;

export type DownloadHref = {
  readonly href: string;
  /** 응답이 attachment로 내려오는지. false면 새 탭으로 열어 페이지 이탈을 막는다. */
  readonly forced: boolean;
};

/**
 * Sanity 파일 CDN은 기본이 `Content-Disposition: inline`이라 PDF가 브라우저에서 열린다.
 * `?dl`을 붙이면 attachment로 내려오고 업로드 당시 원본 파일명이 그대로 유지된다.
 */
export function safeDownloadHref(input: unknown, fallback = "#"): DownloadHref {
  const href = safeContentHref(input, fallback);
  if (!SANITY_FILE_URL.test(href)) return { href, forced: false };

  const url = new URL(href);
  if (!url.searchParams.has("dl")) url.searchParams.set("dl", "");
  return { href: url.href, forced: true };
}
