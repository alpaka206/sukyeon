"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductDetail } from "@/app/products/productDetails";

type Props = {
  readonly label: string;
  readonly items: readonly ProductDetail[];
};

export function ProductDetailSelector({ label, items }: Props) {
  const [selectedCode, setSelectedCode] = useState(items[0]?.code ?? "");
  const selected = items.find((item) => item.code === selectedCode) ?? items[0];

  if (!selected) {
    return null;
  }

  return (
    <div className="rounded-[18px] border border-[#dfe6f0] bg-white p-4 shadow-[0_18px_44px_-18px_rgba(10,27,51,0.12)] sm:p-5">
      <div className="mb-4 font-mono text-[12px] font-bold tracking-[1.5px] text-[#22409b]">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {items.map((item) => {
          const isSelected = item.code === selected.code;
          return (
            <button
              key={item.code}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedCode(item.code)}
              className={`flex min-h-29.5 cursor-pointer flex-col items-center justify-between rounded-[14px] border p-2.5 text-center transition-colors ${
                isSelected
                  ? "border-[#22409b] bg-brand-soft"
                  : "border-[#eaeef3] bg-[#fbfcfe] hover:border-[#b8c5da] hover:bg-white"
              }`}
            >
              <span className="relative block h-17 w-full">
                <Image src={item.image} alt={`${item.code} 제품`} fill sizes="120px" className="object-contain" />
              </span>
              <span className="font-mono text-[13px] font-extrabold text-navy">{item.code}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-75 rounded-[16px] border border-[#eaeef3] bg-[#fbfcfe] p-5">
        <div className="mb-2">
          <h3 className="m-0 font-mono text-[22px] font-extrabold tracking-[-0.3px] text-navy">
            {selected.code}
          </h3>
        </div>
        <p className="m-0 mb-4 text-[15px] leading-[1.7] text-[#5a6680]">{selected.summary}</p>
        <ul className="m-0 grid list-none gap-2.5 p-0">
          {selected.points.map((point) => (
            <li key={point} className="flex gap-2.5 text-[15px] leading-[1.55] text-[#42526b]">
              <span className="mt-[0.1em] font-extrabold text-[#22409b]">·</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {selected.documents && (
          <div className="mt-5 border-t border-[#e2e6ed] pt-4">
            <div className="mb-3 text-[13px] font-extrabold text-navy">관련 자료</div>
            <div className="flex flex-wrap gap-2">
              {selected.documents.map((document) => (
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
  );
}
