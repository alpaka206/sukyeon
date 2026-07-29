import "server-only";
import { Resend } from "resend";

// 키가 없으면 null을 돌려준다. 호출부가 "발송 미설정" 오류를 사용자에게 안내한다.
export function createResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return apiKey ? new Resend(apiKey) : null;
}

// Resend는 도메인 인증을 마친 주소에서만 발송할 수 있다.
export function contactMailFrom(): string {
  return process.env.CONTACT_MAIL_FROM?.trim() || "";
}

export function contactMailTo(): string {
  return process.env.CONTACT_MAIL_TO?.trim() || "";
}
