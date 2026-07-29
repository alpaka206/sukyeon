"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactInquiry } from "@/app/(site)/contact/actions";
import { CONTACT_PRODUCTS, EMPTY_CONTACT_FORM_STATE } from "@/lib/contactInquiry";

const inputCls =
  "h-12 w-full rounded-[10px] border border-[#d4dae4] px-4 text-[15px] text-navy outline-none transition-colors focus:border-[#22409b]";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactInquiry,
    EMPTY_CONTACT_FORM_STATE,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // React가 액션 종료 후 폼을 초기화하므로 입력값은 defaultValue(=서버가 돌려준 값)로 복원된다.
  // 오류일 때는 작성 내용이 그대로 남고, 성공하면 서버가 빈 값을 돌려주어 폼이 비워진다.
  useEffect(() => {
    if (state.status !== "error" || !state.field) return;
    formRef.current?.querySelector<HTMLElement>(`#${state.field}`)?.focus();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-[18px] border border-[#eaeef3] p-6 sm:p-10"
    >
      <h2 className="m-0 mb-2 text-[24px] font-extrabold tracking-[-0.5px] text-navy">
        견적·문의 작성
      </h2>
      <p className="m-0 mb-7.5 text-[15px] text-[#5a6680]">
        아래 항목을 작성해 주시면 담당자에게 바로 전달되며, 확인 후 신속히 회신드립니다.
      </p>

      {state.status === "sent" && (
        <div
          role="status"
          className="mb-5 rounded-[10px] bg-brand-soft px-4 py-3 text-[14px] font-semibold text-[#22409b]"
        >
          문의가 정상적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.
        </div>
      )}

      {/* 봇 감지용 허니팟. 화면에도, 보조 기기에도 노출되지 않아야 한다. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">홈페이지</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="contact-company" label="회사명" required>
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            required
            maxLength={100}
            className={inputCls}
            placeholder="회사명을 입력하세요"
            defaultValue={state.values.company}
          />
        </Field>
        <Field id="contact-name" label="담당자명" required>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            maxLength={50}
            className={inputCls}
            placeholder="이름을 입력하세요"
            defaultValue={state.values.name}
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
            maxLength={40}
            className={inputCls}
            placeholder="010-0000-0000"
            defaultValue={state.values.phone}
          />
        </Field>
        <Field id="contact-email" label="이메일">
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            className={inputCls}
            placeholder="email@company.com"
            defaultValue={state.values.email}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field id="contact-product" label="문의 제품">
          <select
            id="contact-product"
            name="product"
            className={`${inputCls} bg-white`}
            defaultValue={state.values.product}
          >
            {CONTACT_PRODUCTS.map((product) => (
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
            maxLength={4000}
            className="h-35 w-full resize-y rounded-[10px] border border-[#d4dae4] p-4 text-[15px] leading-[1.6] text-navy outline-none transition-colors focus:border-[#22409b]"
            placeholder="합금 종류, 금형, 생산 사이클 등 공정 정보를 알려주시면 더 정확한 견적이 가능합니다."
            defaultValue={state.values.message}
          />
        </Field>
      </div>

      <label className="mt-4.5 flex cursor-pointer items-center gap-2.5">
        <input
          id="contact-agree"
          name="agree"
          type="checkbox"
          required
          className="h-4.5 w-4.5 accent-[#22409b]"
        />
        <span className="text-[14px] text-[#5a6680]">개인정보 수집 및 이용에 동의합니다.</span>
      </label>

      {state.status === "error" && state.message && (
        <p role="alert" aria-live="polite" className="mt-3 text-[14px] font-semibold text-[#d23b3b]">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-7 w-full cursor-pointer rounded-[10px] bg-navy py-4 text-center text-[16px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-progress disabled:opacity-60"
      >
        {isPending ? "전송 중..." : "견적 문의 보내기"}
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
