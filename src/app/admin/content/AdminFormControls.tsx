"use client";

import { type DragEventHandler, type ReactNode, useId, useState } from "react";

export type InlineError = {
  readonly field: string;
  readonly message: string;
};

const secondaryButtonClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#c7d2e5] bg-white px-4 py-2 text-[14px] font-extrabold text-[#18306f] shadow-[0_8px_18px_-16px_rgba(10,27,51,0.45)] transition-[background,border-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-[#22409b] hover:bg-[#eef2fc] hover:shadow-[0_14px_28px_-18px_rgba(10,27,51,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";

function ChevronIcon({ open }: { readonly open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`size-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M5.5 8 10 12.5 14.5 8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
      <path
        d="M10 4.5v11M4.5 10h11"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
      <path
        d="M7 8v6m3-6v6m3-6v6M5.5 6h9M8 6V4.5h4V6m-5.5 0 .5 10h6l.5-10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-4 text-[#8a97ad]"
    >
      <path
        d="M7 5.5h.01M13 5.5h.01M7 10h.01M13 10h.01M7 14.5h.01M13 14.5h.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

function MoveIcon({ direction }: { readonly direction: "up" | "down" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
      <path
        d={direction === "up" ? "m6 11 4-4 4 4" : "m6 9 4 4 4-4"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FormSection({
  title,
  description,
  children,
  defaultOpen = false,
  action,
}: {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
  readonly action?: ReactNode;
}) {
  const contentId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      onInvalidCapture={() => setOpen(true)}
      className="overflow-hidden rounded-2xl border border-[#d8e0ec] bg-white shadow-[0_18px_44px_-36px_rgba(10,27,51,0.26)]"
    >
      <div className="flex min-h-17 w-full items-center justify-between gap-4 bg-[#f8fafc] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={open}
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e0ec] bg-white text-[#22409b] transition-colors hover:border-[#22409b] hover:bg-[#eef2fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b]"
            title={open ? "섹션 접기" : "섹션 펼치기"}
          >
            <ChevronIcon open={open} />
          </button>
          <span className="min-w-0">
            <span className="block text-[18px] font-extrabold leading-tight text-[#0a1b33]">
              {title}
            </span>
            {description && (
              <span className="mt-1.5 block text-[13.5px] font-semibold leading-5 text-[#5a6680]">
                {description}
              </span>
            )}
          </span>
        </div>
        {action && (
          <div
            className="shrink-0"
            onPointerDownCapture={() => setOpen(true)}
            onKeyDownCapture={(event) => {
              if (event.key === "Enter" || event.key === " ") setOpen(true);
            }}
          >
            {action}
          </div>
        )}
      </div>
      <div
        id={contentId}
        hidden={!open}
        className="border-t border-[#e5ebf3] bg-white p-4 sm:p-5"
      >
        {children}
      </div>
    </section>
  );
}

export function RepeaterCard({
  title,
  children,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  defaultOpen = false,
  dragging = false,
}: {
  readonly title: string;
  readonly children: ReactNode;
  readonly onRemove: () => void;
  readonly onDragStart?: DragEventHandler<HTMLElement>;
  readonly onDragOver?: DragEventHandler<HTMLElement>;
  readonly onDrop?: DragEventHandler<HTMLElement>;
  readonly onDragEnd?: DragEventHandler<HTMLElement>;
  readonly onMoveUp?: () => void;
  readonly onMoveDown?: () => void;
  readonly defaultOpen?: boolean;
  readonly dragging?: boolean;
}) {
  const contentId = useId();
  const [open, setOpen] = useState(defaultOpen);
  // 카드 전체가 항상 draggable이면 입력칸의 마우스 텍스트 선택이 드래그로 먹힌다.
  // 그립을 누르고 있는 동안에만 드래그를 허용한다.
  const [dragArmed, setDragArmed] = useState(false);

  return (
    <article
      draggable={dragArmed}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={(event) => {
        setDragArmed(false);
        onDragEnd?.(event);
      }}
      onInvalidCapture={() => setOpen(true)}
      className={`rounded-2xl border border-[#cfd8e6] bg-white shadow-[0_14px_34px_-30px_rgba(10,27,51,0.35)] transition-[border-color,box-shadow,opacity,transform] duration-150 focus-within:border-[#22409b] hover:border-[#b8c5da] hover:shadow-[0_18px_44px_-32px_rgba(10,27,51,0.42)] ${dragging ? "scale-[0.99] opacity-55" : ""}`}
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-3 bg-[#f8fafc] px-3 py-3 sm:px-4 ${open ? "rounded-t-2xl border-b border-[#e5ebf3]" : "rounded-2xl"}`}
      >
        <h3 className="m-0 flex min-w-0 items-center gap-2 text-[16px] font-extrabold text-[#0a1b33]">
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={open}
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d8e0ec] bg-white text-[#18306f] transition-colors hover:border-[#22409b] hover:bg-[#eef2fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b]"
            title={open ? "상세 접기" : "상세 펼치기"}
          >
            <ChevronIcon open={open} />
          </button>
          <span
            onPointerDown={() => setDragArmed(true)}
            onPointerUp={() => setDragArmed(false)}
            onPointerCancel={() => setDragArmed(false)}
            className="inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg bg-white ring-1 ring-[#d8e0ec] active:cursor-grabbing"
            title="잡아서 순서 변경"
          >
            <GripIcon />
          </span>
          <span className="truncate">{title}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              aria-label="위로 이동"
              title="위로 이동"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-[#c7d2e5] bg-white text-[#18306f] transition-[background,border-color,transform] duration-150 hover:-translate-y-px hover:border-[#22409b] hover:bg-[#eef2fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b]"
            >
              <MoveIcon direction="up" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              aria-label="아래로 이동"
              title="아래로 이동"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-[#c7d2e5] bg-white text-[#18306f] transition-[background,border-color,transform] duration-150 hover:-translate-y-px hover:border-[#22409b] hover:bg-[#eef2fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b]"
            >
              <MoveIcon direction="down" />
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#f0c9c9] bg-white px-3 py-2 text-[13px] font-extrabold text-[#b3261e] transition-[background,border-color,transform] duration-150 hover:-translate-y-px hover:bg-[#fff5f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b3261e]"
          >
            <TrashIcon />
            삭제
          </button>
        </div>
      </div>
      <div id={contentId} hidden={!open} className="grid gap-4 p-3 sm:p-4">
        {children}
      </div>
    </article>
  );
}

export function AddRepeaterButton({
  label,
  onClick,
}: {
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={secondaryButtonClassName}
    >
      <PlusIcon />
      {label} 추가
    </button>
  );
}

export function EmptyRepeaterState({
  label,
  onAdd,
}: {
  readonly label: string;
  readonly onAdd: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#b8c5da] bg-[#f8fafc] px-4 py-5 text-center">
      <p className="m-0 text-[14px] font-bold text-[#42526b]">
        아직 등록된 {label} 항목이 없습니다.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#22409b] px-4 py-2 text-[14px] font-extrabold text-white transition-colors hover:bg-[#18306f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b]"
      >
        <PlusIcon />첫 {label} 추가
      </button>
    </div>
  );
}

export function ErrorSummary({
  errors,
}: {
  readonly errors: readonly InlineError[];
}) {
  if (errors.length === 0) return null;
  return (
    <section
      aria-labelledby="form-error-summary"
      role="alert"
      className="rounded-xl border border-[#f0c9c9] bg-[#fff5f5] p-4 text-[#7f1d1d]"
    >
      <h2 id="form-error-summary" className="m-0 text-[16px] font-extrabold">
        확인이 필요한 항목이 있습니다
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-5">
        {errors.map((error) => (
          <li key={`${error.field}-${error.message}`}>
            <a
              className="font-semibold underline underline-offset-2"
              href={`#${error.field}`}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EditorNotice({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#cfd9f3] bg-[#eef2fc] p-4 text-[14px] leading-6 text-[#18306f] sm:flex-row sm:items-center sm:justify-between">
      <p className="m-0 font-semibold">{children}</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-[#b8c5da] bg-white px-3 py-1.5 text-[13px] font-extrabold text-[#18306f] transition-colors duration-150 hover:border-[#22409b] hover:bg-[#fbfcfe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b]"
      >
        공개 페이지 미리보기
      </a>
    </div>
  );
}

// 서버 액션이 돌려준 에러 필드로 이동한다. 대상이 접힌 섹션/카드의 hidden 컨테이너
// 안에 있으면 aria-controls 토글을 눌러 펼친 뒤 포커스한다.
export function revealAndFocusField(form: HTMLFormElement, field: string): void {
  const target = form.ownerDocument.getElementById(field);
  if (!target) return;
  let ancestor = target.parentElement;
  while (ancestor && ancestor !== form.parentElement) {
    if (ancestor.hasAttribute("hidden") && ancestor.id) {
      form
        .querySelector<HTMLButtonElement>(
          `[aria-controls="${CSS.escape(ancestor.id)}"][aria-expanded="false"]`,
        )
        ?.click();
    }
    ancestor = ancestor.parentElement;
  }
  window.requestAnimationFrame(() => {
    target.scrollIntoView({ block: "center" });
    target.focus({ preventScroll: true });
  });
}

export function StickySaveBar({
  formId,
  saving = false,
  changed = false,
  onCancel,
}: {
  readonly formId?: string;
  readonly saving?: boolean;
  readonly changed?: boolean;
  readonly onCancel?: () => void;
}) {
  if (!changed && !saving) return null;

  const status = changed
    ? "저장하지 않은 변경사항이 있습니다."
    : "변경한 내용은 저장을 눌러야 반영됩니다.";

  return (
    <div
      className={`z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 shadow-[0_18px_44px_-24px_rgba(10,27,51,0.42)] backdrop-blur lg:sticky lg:bottom-4 ${changed ? "border-[#22409b] bg-[#eef2fc]/95" : "border-[#d4dae4] bg-white/95"}`}
    >
      <p className="m-0 flex items-center gap-2 text-[13px] font-bold text-[#42526b]">
        <span
          className={`size-2.5 rounded-full ${changed ? "bg-[#22409b]" : "bg-[#b8c5da]"}`}
        />
        {status}
      </p>
      <div className="flex flex-wrap gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={secondaryButtonClassName}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          form={formId}
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#22409b] px-6 py-2 text-[15px] font-extrabold text-white shadow-[0_14px_28px_-18px_rgba(34,64,155,0.85)] transition-colors duration-150 hover:bg-[#18306f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22409b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "저장 중" : "저장하기"}
        </button>
      </div>
    </div>
  );
}
