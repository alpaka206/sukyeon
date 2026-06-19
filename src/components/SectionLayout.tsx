"use client";

import { useEffect, useState, useCallback } from "react";

export type SectionNavItem = { id: string; label: string };

type Props = {
  eyebrow: string;
  title: string;
  items: SectionNavItem[];
  children: React.ReactNode;
};

export default function SectionLayout({ eyebrow, title, items, children }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const onScroll = () => {
      let cur = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 150) cur = it.id;
      }
      setActive((prev) => (prev !== cur ? cur : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* mobile horizontal tab strip */}
      <div className="sticky top-[78px] z-30 border-b border-[#eaeef3] bg-white/95 backdrop-blur-[10px] lg:hidden">
        <div className="flex gap-1 overflow-x-auto px-5 py-2.5">
          {items.map((it) => {
            const on = active === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => goTo(it.id)}
                className="whitespace-nowrap rounded-full px-4 py-2 text-[14px] transition-colors"
                style={{
                  fontWeight: on ? 700 : 600,
                  color: on ? "#0a1b33" : "#5a6680",
                  background: on ? "#eef2fc" : "transparent",
                }}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="shell-grid lg:grid lg:grid-cols-[250px_1fr]">
        {/* desktop vertical LNB */}
        <aside className="hidden border-r border-[#eaeef3] bg-[#fbfcfe] lg:block">
          <div className="sticky top-[78px] py-[38px]">
            <div className="px-8 pb-1.5 font-mono text-[12px] tracking-[2px] text-[#22409b]">
              {eyebrow}
            </div>
            <div className="px-8 pb-[22px] text-[21px] font-extrabold text-[#0a1b33]">{title}</div>
            <div className="flex flex-col">
              {items.map((it) => {
                const on = active === it.id;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => goTo(it.id)}
                    className="lnb-item block cursor-pointer border-l-[3px] px-8 py-3.5 text-left text-[16px]"
                    style={{
                      fontWeight: on ? 700 : 600,
                      color: on ? "#0a1b33" : "#5a6680",
                      borderLeftColor: on ? "#22409b" : "transparent",
                      background: on ? "#eef2fc" : "transparent",
                    }}
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </>
  );
}
