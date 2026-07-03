"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryItem = {
  readonly image: string;
  readonly title: string;
  readonly summary?: string;
  readonly points?: readonly string[];
  readonly documents?: readonly { readonly label: string; readonly href: string }[];
};

type Props = {
  readonly items: readonly GalleryItem[];
  readonly groupLabel: string;
  readonly variant?: "wide" | "panel";
};

export function ProductGallery({ items, groupLabel, variant = "wide" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const gridCols =
    variant === "panel"
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  const wellHeight = variant === "panel" ? "h-32" : "h-40";

  return (
    <>
      <div className={`grid gap-4 ${gridCols}`}>
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="card-link group flex cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#e2e6ed] bg-white text-left"
          >
            <div className={`flex ${wellHeight} items-center justify-center border-b border-[#eef1f5] bg-white p-4`}>
              <Image
                src={item.image}
                alt={item.title}
                width={280}
                height={160}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>
            {variant === "panel" ? (
              <div className="p-3 text-center">
                <h3 className="m-0 font-mono text-[13.5px] font-extrabold text-navy">{item.title}</h3>
              </div>
            ) : (
              <div className="flex flex-1 flex-col p-4">
                <h3 className="m-0 text-[15px] font-extrabold text-navy">{item.title}</h3>
                {item.summary && (
                  <p className="m-0 mt-1 line-clamp-1 text-[13px] leading-[1.5] text-[#5a6680]">{item.summary}</p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-[#22409b]">
                  자세히 보기
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <ProductModal
          items={items}
          index={openIndex}
          groupLabel={groupLabel}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}

type ModalProps = {
  readonly items: readonly GalleryItem[];
  readonly index: number;
  readonly groupLabel: string;
  readonly onClose: () => void;
  readonly onIndexChange: (i: number) => void;
};

function ProductModal({ items, index, groupLabel, onClose, onIndexChange }: ModalProps) {
  const item = items[index];
  const many = items.length > 1;

  const goPrev = useCallback(
    () => onIndexChange((index - 1 + items.length) % items.length),
    [index, items.length, onIndexChange],
  );
  const goNext = useCallback(
    () => onIndexChange((index + 1) % items.length),
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && many) goPrev();
      else if (e.key === "ArrowRight" && many) goNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext, many]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || !many) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (dx > 50) goPrev();
    else if (dx < -50) goNext();
    touchX.current = null;
  };

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${groupLabel} ${item.title}`}
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(6,14,28,0.62)] backdrop-blur-[2px]"
      />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[20px] bg-white shadow-[0_40px_120px_-30px_rgba(6,14,28,0.6)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#eef1f5] bg-white px-6 py-4">
          <div className="font-mono text-[12px] font-bold tracking-[1.5px] text-[#22409b]">
            {groupLabel}
            {many && <span className="ml-2 text-[#8a96ab]">{index + 1} / {items.length}</span>}
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5a6680] transition-colors hover:bg-[#f1f4f8]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[0.82fr_1.18fr] sm:p-7">
          <div className="flex h-56 items-center justify-center rounded-[14px] border border-[#eef1f5] bg-[#fbfcfe] p-4 sm:h-72">
            <Image
              src={item.image}
              alt={item.title}
              width={440}
              height={320}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h3 className="m-0 mb-2 font-mono text-[23px] font-extrabold tracking-[-0.3px] text-navy">
              {item.title}
            </h3>
            {item.summary && (
              <p className="m-0 mb-4 text-[15px] leading-[1.7] text-[#5a6680]">{item.summary}</p>
            )}
            {item.points && (
              <ul className="m-0 grid list-none gap-2 p-0">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-[14.5px] leading-[1.55] text-[#42526b]">
                    <span className="mt-[0.1em] font-extrabold text-[#22409b]">·</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
            {item.documents && (
              <div className="mt-5 border-t border-[#e2e6ed] pt-4">
                <div className="mb-3 text-[13px] font-extrabold text-navy">관련 자료</div>
                <div className="flex flex-wrap gap-2">
                  {item.documents.map((document) => (
                    <Link
                      key={document.href}
                      href={document.href}
                      className="rounded-md bg-brand-soft px-3 py-2 text-[13px] font-bold text-[#22409b] transition-colors hover:bg-[#dfe7fb]"
                    >
                      {document.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {many && (
          <div className="flex gap-2 overflow-x-auto border-t border-[#eef1f5] px-6 py-4">
            {items.map((it, i) => (
              <button
                key={it.title}
                type="button"
                aria-label={it.title}
                aria-pressed={i === index}
                onClick={() => onIndexChange(i)}
                className={`relative h-14 w-16 shrink-0 cursor-pointer rounded-[10px] border transition-colors ${
                  i === index
                    ? "border-[#22409b] bg-brand-soft"
                    : "border-[#eaeef3] bg-[#fbfcfe] hover:border-[#b8c5da]"
                }`}
              >
                <Image src={it.image} alt={it.title} fill sizes="64px" className="object-contain p-1.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
