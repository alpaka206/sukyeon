"use client";

import { useEffect, useState } from "react";

export type HeroSlide = { readonly src: string; readonly mobileSrc: string; readonly alt: string };

export default function HeroCarousel({ slides }: { readonly slides: readonly HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setActive((s) => (s + 1) % slides.length);
    }, 3000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return <div className="h-full min-h-65 bg-[#f7f7f7]" />;

  return (
    <div className="relative h-full min-h-65 overflow-hidden bg-[#f7f7f7]">
      {slides.map((s, i) => (
        <picture
          key={s.src || i}
          className="absolute inset-0 block h-full w-full transition-opacity duration-900 ease-in-out"
          style={{ opacity: active === i ? 1 : 0 }}
        >
          {/* md(768px) 이상: 데스크톱 이미지 / 미만: 모바일 이미지 */}
          <source media="(min-width: 768px)" srcSet={s.src} />
          <img
            src={s.mobileSrc}
            alt={s.alt}
            decoding="async"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            className="h-full w-full object-contain md:object-cover"
          />
        </picture>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,27,51,0.2))]" />
    </div>
  );
}
