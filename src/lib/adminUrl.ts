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
