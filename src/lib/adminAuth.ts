import crypto from "node:crypto";

// 회원가입 없이, env에 지정한 단일 관리자 계정만 사용.
// 세션은 HMAC 서명 토큰(쿠키). 쿠키 payload에는 만료시각만 담아 어떤 env값도 노출하지 않는다.
// (node:crypto 임포트 때문에 이 파일은 클라이언트 번들에 포함될 수 없다.)

export const SESSION_COOKIE = "sk_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12시간(초)

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function adminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET,
  );
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME || "";
  const p = process.env.ADMIN_PASSWORD || "";
  if (!u || !p) return false;
  return safeEqual(username, u) && safeEqual(password, p);
}

function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(): string {
  // payload = 만료시각만. 아이디/비번/시크릿 어느 것도 담지 않는다.
  const body = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE * 1000 })).toString(
    "base64url",
  );
  return `${body}.${sign(body)}`;
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [body, sig] = parts;
  // 서명이 시크릿과 일치해야만 통과 → 시크릿 없이는 위조 불가.
  if (!safeEqual(sig, sign(body))) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
