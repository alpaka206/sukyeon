"use client";

import { type FormEvent, useState } from "react";

const inputCls =
  "h-12 w-full rounded-[10px] border border-[#d4dae4] px-4 text-[15px] text-navy outline-none transition-colors focus:border-[#22409b]";

const products = [
  "이형제",
  "프란자오일",
  "작동유",
  "습동면유",
  "소모성 부자재",
  "기타 / 복합 문의",
];

const DEFAULT_RECIPIENT = "sukyeonmro@naver.com";
const SIMPLE_EMAIL_PATTERN = /^[^\s?&#]+@[^\s?&#]+\.[^\s?&#]+$/;

function resolveRecipientEmail(value: string | null | undefined): string {
  const candidate = value?.trim() ?? "";
  return SIMPLE_EMAIL_PATTERN.test(candidate) ? candidate : DEFAULT_RECIPIENT;
}

type ContactFormProps = {
  readonly recipientEmail?: string | null;
};

export default function ContactForm({ recipientEmail }: ContactFormProps) {
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    product: products[0],
    message: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.company.trim() || !form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("회사명·담당자명·연락처·문의 내용은 필수 입력 항목입니다.");
      return;
    }
    if (!form.agree) {
      setError("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    const recipient = resolveRecipientEmail(recipientEmail);
    const subject = `[견적·문의] ${form.company.trim()}`;
    const body = [
      `회사명: ${form.company.trim()}`,
      `담당자: ${form.name.trim()}`,
      `연락처: ${form.phone.trim()}`,
      `이메일: ${form.email.trim()}`,
      `문의 제품: ${form.product}`,
      "",
      form.message.trim(),
    ].join("\r\n");
    const query = new URLSearchParams({ subject, body });

    setError("");
    setSent(true);
    window.location.assign(`mailto:${recipient}?${query.toString()}`);
  };

  return (
    <form onSubmit={submit} className="rounded-[18px] border border-[#eaeef3] p-6 sm:p-10">
      <h2 className="m-0 mb-2 text-[24px] font-extrabold tracking-[-0.5px] text-navy">
        견적·문의 작성
      </h2>
      <p className="m-0 mb-7.5 text-[15px] text-[#5a6680]">
        아래 항목을 작성하면 기본 메일 앱에 문의 내용이 입력됩니다.
      </p>

      {sent && (
        <div
          role="status"
          className="mb-5 rounded-[10px] bg-brand-soft px-4 py-3 text-[14px] font-semibold text-[#22409b]"
        >
          메일 작성 창이 열렸습니다. 메일 앱에서 전송을 완료해 주세요.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="contact-company" label="회사명" required>
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            required
            className={inputCls}
            placeholder="회사명을 입력하세요"
            value={form.company}
            onChange={(event) => update("company", event.target.value)}
          />
        </Field>
        <Field id="contact-name" label="담당자명" required>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            className={inputCls}
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </Field>
        <Field id="contact-phone" label="연락처" required>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={inputCls}
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </Field>
        <Field id="contact-email" label="이메일">
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={inputCls}
            placeholder="email@company.com"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field id="contact-product" label="문의 제품">
          <select
            id="contact-product"
            name="product"
            className={`${inputCls} bg-white`}
            value={form.product}
            onChange={(event) => update("product", event.target.value)}
          >
            {products.map((product) => (
              <option key={product}>{product}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="contact-message" label="문의 내용" required>
          <textarea
            id="contact-message"
            name="message"
            required
            className="h-35 w-full resize-y rounded-[10px] border border-[#d4dae4] p-4 text-[15px] leading-[1.6] text-navy outline-none transition-colors focus:border-[#22409b]"
            placeholder="합금 종류, 금형, 생산 사이클 등 공정 정보를 알려주시면 더 정확한 견적이 가능합니다."
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </Field>
      </div>

      <label className="mt-4.5 flex cursor-pointer items-center gap-2.5">
        <input
          name="agree"
          type="checkbox"
          required
          className="h-4.5 w-4.5 accent-[#22409b]"
          checked={form.agree}
          onChange={(event) => update("agree", event.target.checked)}
        />
        <span className="text-[14px] text-[#5a6680]">개인정보 수집 및 이용에 동의합니다.</span>
      </label>

      {error && (
        <p role="alert" aria-live="polite" className="mt-3 text-[14px] font-semibold text-[#d23b3b]">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-7 w-full cursor-pointer rounded-[10px] bg-navy py-4 text-center text-[16px] font-bold text-white transition-opacity hover:opacity-90"
      >
        메일 앱으로 견적 문의 작성
      </button>
    </form>
  );
}

type FieldProps = {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly children: React.ReactNode;
};

function Field({ id, label, required = false, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-semibold text-navy">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
