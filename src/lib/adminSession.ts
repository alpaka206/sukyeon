import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./adminAuth";

// 로그인 세션 검증(서버 전용). 유효한 서명 쿠키가 없으면 false.
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
