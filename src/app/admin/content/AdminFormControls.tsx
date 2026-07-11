"use client";

import { type ReactNode, useId, useState } from "react";

export type InlineError = {
  readonly field: string;
  readonly message: string;
};

const secondaryButtonClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d4dae4] bg-white px-4 py-2 text-[14px] font-bold text-[#18306f] transition-[background,border-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-[#22409b] hover:bg-[#eef2fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";

const iconButtonClassName =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-[#d4dae4] bg-white px-3 py-2 text-[13px] font-extrabold text-[#18306f] transition-[background,border-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-[#22409b] hover:bg-[#eef2fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45";

function ChevronIcon({ open }: { readonly open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
      <path d="M5.5 8 10 12.5 14.5 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ArrowIcon({ direction }: { readonly direction: "up" | "down" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 ${direction === "up" ? "" : "rotate-180"}`}>
      <path d="M10 15V5m0 0L6.5 8.5M10 5l3.5 3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
      <path d="M10 4.5v11M4.5 10h11" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
      <path d="M7 8v6m3-6v6m3-6v6M5.5 6h9M8 6V4.5h4V6m-5.5 0 .5 10h6l.5-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function FormSection({
  title, description, children, defaultOpen = true,
}: {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
}) {
  const contentId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2e6ed] bg-white shadow-[0_18px_44px_-34px_rgba(10,27,51,0.28)]">
      <button type="button" aria-controls={contentId} aria-expanded={open} onClick={() => setOpen((currentOpen) => !currentOpen)} className="flex min-h-16 w-full items-center justify-between gap-4 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)] px-4 py-4 text-left transition-colors duration-150 hover:bg-[#fbfcfe] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#22409b] sm:px-5">
        <span className="min-w-0">
          <span className="mb-1 block text-[11px] font-extrabold tracking-[0.12em] text-[#22409b]">SECTION</span>
          <span className="block text-[17px] font-extrabold leading-tight text-[#0a1b33]">{title}</span>
          {description && <span className="mt-1.5 block text-[13.5px] font-normal leading-5 text-[#5a6680]">{description}</span>}
        </span>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#d4dae4] bg-white px-3 py-2 text-[13px] font-extrabold text-[#18306f]">
          {open ? "접기" : "펼치기"}
          <ChevronIcon open={open} />
        </span>
      </button>
      <div id={contentId} hidden={!open} className="border-t border-[#eaeef3] bg-white p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function RepeaterCard({
  title, children, onRemove, onMoveUp, onMoveDown, moveUpDisabled = false, moveDownDisabled = false,
}: {
  readonly title: string;
  readonly children: ReactNode;
  readonly onRemove: () => void;
  readonly onMoveUp: () => void;
  readonly onMoveDown: () => void;
  readonly moveUpDisabled?: boolean;
  readonly moveDownDisabled?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#d4dae4] bg-white p-3 shadow-[0_14px_34px_-30px_rgba(10,27,51,0.35)] transition-[border-color,box-shadow] duration-150 focus-within:border-[#b8c5da] hover:border-[#b8c5da] hover:shadow-[0_18px_44px_-32px_rgba(10,27,51,0.42)] sm:p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fbfcfe] px-3 py-3">
        <h3 className="m-0 flex min-w-0 items-center gap-2 text-[16px] font-extrabold text-[#0a1b33]">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#eef2fc] text-[12px] text-[#22409b]">#</span>
          <span className="truncate">{title}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onMoveUp} disabled={moveUpDisabled} className={iconButtonClassName} aria-label={`${title} 위로 이동`} title="위로 이동">
            <ArrowIcon direction="up" />
            <span className="hidden sm:inline">위로</span>
          </button>
          <button type="button" onClick={onMoveDown} disabled={moveDownDisabled} className={iconButtonClassName} aria-label={`${title} 아래로 이동`} title="아래로 이동">
            <ArrowIcon direction="down" />
            <span className="hidden sm:inline">아래로</span>
          </button>
          <button type="button" onClick={onRemove} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#f0c9c9] bg-white px-3 py-2 text-[13px] font-extrabold text-[#b3261e] transition-[background,border-color,transform] duration-150 hover:-translate-y-px hover:bg-[#fff5f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b3261e]">
            <TrashIcon />
            삭제
          </button>
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </article>
  );
}

export function AddRepeaterButton({ label, onClick }: { readonly label: string; readonly onClick: () => void }) {
  return <button type="button" onClick={onClick} className={secondaryButtonClassName}><PlusIcon />{label} 추가</button>;
}

export function ErrorSummary({ errors }: { readonly errors: readonly InlineError[] }) {
  if (errors.length === 0) return null;
  return (
    <section aria-labelledby="form-error-summary" role="alert" className="rounded-xl border border-[#f0c9c9] bg-[#fff5f5] p-4 text-[#7f1d1d]">
      <h2 id="form-error-summary" className="m-0 text-[16px] font-extrabold">확인이 필요한 항목이 있습니다</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-5">{errors.map((error) => <li key={`${error.field}-${error.message}`}><a className="font-semibold underline underline-offset-2" href={`#${error.field}`}>{error.message}</a></li>)}</ul>
    </section>
  );
}

export function EditorNotice({ href, children }: { readonly href: string; readonly children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#cfd9f3] bg-[#eef2fc] p-4 text-[14px] leading-6 text-[#18306f]">
      <p className="m-0">{children}</p>
      <a href={href} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-10 items-center rounded-lg border border-[#b8c5da] bg-white px-3 py-1.5 text-[13px] font-extrabold text-[#18306f] transition-colors duration-150 hover:border-[#22409b] hover:bg-[#fbfcfe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b]">
        공개 페이지 미리보기
      </a>
    </div>
  );
}

export function StickySaveBar({ formId, saving = false, changed = false, onCancel }: { readonly formId?: string; readonly saving?: boolean; readonly changed?: boolean; readonly onCancel?: () => void }) {
  const status = changed ? "저장하지 않은 변경사항이 있습니다." : "변경한 내용은 저장을 눌러야 반영됩니다.";

  return (
    <div className={`z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 shadow-[0_18px_44px_-24px_rgba(10,27,51,0.42)] backdrop-blur lg:sticky lg:bottom-4 ${changed ? "border-[#b8c5da] bg-[#eef2fc]/95" : "border-[#d4dae4] bg-white/95"}`}>
      <p className="m-0 flex items-center gap-2 text-[13px] font-bold text-[#42526b]">
        <span className={`size-2.5 rounded-full ${changed ? "bg-[#22409b]" : "bg-[#b8c5da]"}`} />
        {status}
      </p>
      <div className="flex flex-wrap gap-2">{onCancel && <button type="button" onClick={onCancel} className={secondaryButtonClassName}>취소</button>}<button type="submit" form={formId} disabled={saving} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#22409b] px-5 py-2 text-[15px] font-extrabold text-white transition-colors duration-150 hover:bg-[#18306f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "저장 중" : "저장"}</button></div>
    </div>
  );
}
