"use client";

import { useState } from "react";

const inputCls =
  "h-12 w-full rounded-[10px] border border-[#d4dae4] px-4 text-[15px] text-[#0a1b33] outline-none transition-colors focus:border-[#0fb0c8]";

const products = [
  "이형제",
  "프란자오일",
  "작동유",
  "습동면유",
  "소모성 부자재",
  "기타 / 복합 문의",
];

export default function ContactForm() {
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

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.company.trim() || !form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("회사명·담당자명·연락처·문의 내용은 필수 입력 항목입니다.");
      return;
    }
    if (!form.agree) {
      setError("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }
    setError("");
    // 백엔드 연동 전: 메일 클라이언트로 내용 전달
    const body = `회사명: ${form.company}%0D%0A담당자: ${form.name}%0D%0A연락처: ${form.phone}%0D%0A이메일: ${form.email}%0D%0A문의 제품: ${form.product}%0D%0A%0D%0A${form.message}`;
    window.location.href = `mailto:sukyeonmro@naver.com?subject=[견적·문의] ${form.company}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="rounded-[18px] border border-[#eaeef3] p-6 sm:p-10">
      <h2 className="m-0 mb-2 text-[24px] font-extrabold tracking-[-0.5px] text-[#0a1b33]">
        견적·문의 작성
      </h2>
      <p className="m-0 mb-[30px] text-[15px] text-[#5a6680]">
        아래 항목을 작성해 주시면 담당 엔지니어가 24시간 내 회신드립니다.
      </p>

      {sent && (
        <div className="mb-5 rounded-[10px] bg-[#e9f8fb] px-4 py-3 text-[14px] font-semibold text-[#0a8499]">
          메일 작성 창이 열립니다. 전송이 완료되면 담당자가 확인 후 회신드립니다.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="회사명 *">
          <input
            className={inputCls}
            placeholder="회사명을 입력하세요"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </Field>
        <Field label="담당자명 *">
          <input
            className={inputCls}
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>
        <Field label="연락처 *">
          <input
            className={inputCls}
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </Field>
        <Field label="이메일">
          <input
            className={inputCls}
            placeholder="email@company.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="문의 제품">
          <select
            className={`${inputCls} bg-white`}
            value={form.product}
            onChange={(e) => update("product", e.target.value)}
          >
            {products.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="문의 내용 *">
          <textarea
            className="h-[140px] w-full resize-y rounded-[10px] border border-[#d4dae4] p-4 text-[15px] leading-[1.6] text-[#0a1b33] outline-none transition-colors focus:border-[#0fb0c8]"
            placeholder="합금 종류, 금형, 생산 사이클 등 공정 정보를 알려주시면 더 정확한 견적이 가능합니다."
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </Field>
      </div>

      <label className="mt-[18px] flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          className="h-[18px] w-[18px] accent-[#0fb0c8]"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
        />
        <span className="text-[14px] text-[#5a6680]">개인정보 수집 및 이용에 동의합니다.</span>
      </label>

      {error && <p className="mt-3 text-[14px] font-semibold text-[#d23b3b]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        className="mt-7 w-full cursor-pointer rounded-[10px] bg-[#0a1b33] py-4 text-center text-[16px] font-bold text-white transition-opacity hover:opacity-90"
      >
        견적 문의 보내기
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-semibold text-[#0a1b33]">{label}</label>
      {children}
    </div>
  );
}
