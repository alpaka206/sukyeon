// 견적·문의 폼의 순수 로직(검증·메일 본문 조립)만 담는다.
// Resend 호출과 환경 변수 읽기는 서버 액션(src/app/(site)/contact/actions.ts)이 맡는다.

export const CONTACT_PRODUCTS = [
  "이형제",
  "프란자오일",
  "작동유",
  "습동면유",
  "소모성 부자재",
  "기타 / 복합 문의",
] as const;

export const CONTACT_FALLBACK_RECIPIENT = "sukyeonmro@naver.com";

// 헤더 인젝션을 막기 위해 제어문자·개행이 없는 단순 주소만 허용한다.
const EMAIL_PATTERN = /^[^\s<>@,;:"'()[\]\\]+@[^\s<>@,;:"'()[\]\\]+\.[A-Za-z]{2,}$/;

// 줄바꿈(\n)을 제외한 C0/C1 제어문자.
const CONTROL_CHARS = new RegExp("[\u0000-\u0009\u000b-\u001f\u007f-\u009f]", "g");

const MAX_LENGTHS = {
  company: 100,
  name: 50,
  phone: 40,
  email: 254,
  product: 40,
  message: 4000,
} as const;

export type ContactInquiry = {
  readonly company: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly product: string;
  readonly message: string;
};

export type ContactFormState = {
  readonly status: "idle" | "sent" | "error";
  readonly message: string;
  readonly field: string;
  readonly values: ContactInquiry;
};

export const EMPTY_CONTACT_INQUIRY: ContactInquiry = {
  company: "",
  name: "",
  phone: "",
  email: "",
  product: CONTACT_PRODUCTS[0],
  message: "",
};

export const EMPTY_CONTACT_FORM_STATE: ContactFormState = {
  status: "idle",
  message: "",
  field: "",
  values: EMPTY_CONTACT_INQUIRY,
};

export function isContactEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

function text(value: FormDataEntryValue | null, limit: number): string {
  if (typeof value !== "string") return "";
  // 메일 헤더/본문을 오염시키는 제어문자를 걷어내고 길이를 제한한다.
  // 문의 내용의 줄바꿈은 살려야 하므로 \n만 남긴다.
  return value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .trim()
    .slice(0, limit);
}

export function parseContactForm(formData: FormData): ContactInquiry {
  const product = text(formData.get("product"), MAX_LENGTHS.product);
  return {
    company: text(formData.get("company"), MAX_LENGTHS.company),
    name: text(formData.get("name"), MAX_LENGTHS.name),
    phone: text(formData.get("phone"), MAX_LENGTHS.phone),
    email: text(formData.get("email"), MAX_LENGTHS.email),
    // 셀렉트 값이 조작돼도 허용 목록 밖이면 "기타 / 복합 문의"로 떨어뜨린다.
    product: (CONTACT_PRODUCTS as readonly string[]).includes(product)
      ? product
      : CONTACT_PRODUCTS[CONTACT_PRODUCTS.length - 1],
    message: text(formData.get("message"), MAX_LENGTHS.message),
  };
}

export type ContactValidationError = {
  readonly field: string;
  readonly message: string;
};

export function contactValidationError(
  inquiry: ContactInquiry,
  agreed: boolean,
): ContactValidationError | null {
  if (!inquiry.company) return { field: "contact-company", message: "회사명을 입력해 주세요." };
  if (!inquiry.name) return { field: "contact-name", message: "담당자명을 입력해 주세요." };
  if (!inquiry.phone) return { field: "contact-phone", message: "연락처를 입력해 주세요." };
  if (inquiry.email && !isContactEmail(inquiry.email)) {
    return { field: "contact-email", message: "이메일 형식을 확인해 주세요." };
  }
  if (!inquiry.message) return { field: "contact-message", message: "문의 내용을 입력해 주세요." };
  if (!agreed) {
    return { field: "contact-agree", message: "개인정보 수집 및 이용에 동의해 주세요." };
  }
  return null;
}

const WEEKDAY_LABELS: Record<string, string> = {
  Sun: "일", Mon: "월", Tue: "화", Wed: "수", Thu: "목", Fri: "금", Sat: "토",
};

// 서버(Vercel)는 UTC로 도니 접수 시각은 한국 시간으로 고정해 표기한다.
// 로케일 데이터가 빈약한 런타임에서도 같은 문구가 나오도록 en-US 숫자 부품만 받아 직접 조립한다.
export function formatKoreanTime(receivedAt: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(receivedAt);
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((entry) => entry.type === type)?.value ?? "";
  const weekday = WEEKDAY_LABELS[part("weekday")] ?? "";

  return `${part("year")}년 ${part("month")}월 ${part("day")}일(${weekday}) ${part("hour")}:${part("minute")} (KST)`;
}

export function buildInquirySubject(inquiry: ContactInquiry): string {
  return `[홈페이지 견적·문의] ${inquiry.company} / ${inquiry.product}`;
}

export function buildInquiryText(inquiry: ContactInquiry, receivedAt: Date): string {
  return [
    `접수 시각: ${formatKoreanTime(receivedAt)}`,
    `회사명: ${inquiry.company}`,
    `담당자: ${inquiry.name}`,
    `연락처: ${inquiry.phone}`,
    `이메일: ${inquiry.email || "(미입력)"}`,
    `문의 제품: ${inquiry.product}`,
    "",
    "문의 내용",
    "----------------------------------------",
    inquiry.message,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildInquiryHtml(inquiry: ContactInquiry, receivedAt: Date): string {
  const rows: readonly (readonly [string, string])[] = [
    ["접수 시각", formatKoreanTime(receivedAt)],
    ["회사명", inquiry.company],
    ["담당자", inquiry.name],
    ["연락처", inquiry.phone],
    ["이메일", inquiry.email || "(미입력)"],
    ["문의 제품", inquiry.product],
  ];
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 16px 6px 0;color:#5a6680;font-weight:600;white-space:nowrap">${escapeHtml(label)}</th><td style="padding:6px 0;color:#101a33">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return [
    '<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.7;color:#101a33">',
    '<h2 style="margin:0 0 16px;font-size:18px">홈페이지 견적·문의가 접수되었습니다</h2>',
    `<table style="border-collapse:collapse;margin-bottom:20px">${tableRows}</table>`,
    '<div style="border-top:1px solid #eaeef3;padding-top:16px">',
    '<strong style="display:block;margin-bottom:8px">문의 내용</strong>',
    `<div style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</div>`,
    "</div></div>",
  ].join("");
}

// 회신 주소는 문의자가 유효한 이메일을 남긴 경우에만 넣는다.
export function inquiryReplyTo(inquiry: ContactInquiry): readonly string[] {
  return isContactEmail(inquiry.email) ? [inquiry.email] : [];
}

export function resolveInquiryRecipient(configured: string | null | undefined): string {
  const candidate = configured?.trim() ?? "";
  return isContactEmail(candidate) ? candidate : CONTACT_FALLBACK_RECIPIENT;
}
