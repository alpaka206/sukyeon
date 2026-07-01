"use client";

import { useState } from "react";
import Link from "next/link";
import { nav, company } from "@/lib/site";

function Chevron() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* utility bar */}
      <div className="hidden h-10 items-center justify-between bg-ink wide-shell text-[13px] text-[#9fb0c9] sm:flex">
        <span className="font-mono tracking-[1px] truncate pr-4">
          다이캐스팅 이형제 · 프란자오일 · 부자재 전문 생산업체
        </span>
        <div className="flex shrink-0 items-center gap-5.5">
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f74e6" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {company.tel}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f74e6" strokeWidth="2">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
            {company.fax}
          </span>
        </div>
      </div>

      {/* nav */}
      <div className="flex h-19.5 items-center justify-between border-b border-[#eaeef3] bg-white/92 wide-shell backdrop-blur-[10px]">
        <Link href="/" className="flex items-center" aria-label="석연MRO 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="석연MRO" className="block h-9.5 w-auto" />
        </Link>

        {/* desktop menu */}
        <nav className="hidden items-center gap-1.5 text-[16px] font-semibold text-[#42526b] lg:flex">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className="nav-link inline-flex cursor-pointer items-center gap-1.25 rounded-lg px-3.5 py-2.5"
                >
                  {item.label}
                  <Chevron />
                </Link>
                {openMenu === item.label && (
                  <div className="absolute left-1/2 top-full z-60 -translate-x-1/2 pt-2">
                    <div className="flex min-w-42.5 flex-col gap-0.5 rounded-xl border border-[#eaeef3] bg-white p-2 shadow-[0_18px_44px_-14px_rgba(10,27,51,0.28)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="drop-item whitespace-nowrap rounded-lg px-4 py-2.75 text-[15px] font-semibold text-[#42526b]"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link cursor-pointer rounded-lg px-3.5 py-2.5"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* desktop buttons */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="/catalog"
            className="btn-outline inline-flex items-center gap-1.75 rounded-[9px] border-[1.5px] border-[#d4dae4] px-4 py-2.25 text-[14px] font-bold text-navy"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            카탈로그
          </Link>
        </div>

        {/* mobile hamburger */}
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-navy lg:hidden"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* mobile panel */}
      {mobileOpen && (
        <div className="border-b border-[#eaeef3] bg-white wide-shell pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {nav.map((item) => (
              <div key={item.label} className="border-b border-[#f0f3f7] py-1">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[16px] font-bold text-navy"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="flex flex-col pb-1.5 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-1.5 text-[14px] font-semibold text-[#5a6680]"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="mt-4 flex gap-2.5">
            <Link
              href="/catalog"
              onClick={() => setMobileOpen(false)}
              className="flex flex-1 items-center justify-center rounded-[9px] border-[1.5px] border-[#d4dae4] py-3 text-[14px] font-bold text-navy"
            >
              카탈로그
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex flex-1 items-center justify-center rounded-[9px] bg-[#22409b] py-3 text-[15px] font-bold text-white"
            >
              견적 문의
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
