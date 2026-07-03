"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/assets/hero/hero-1.png", mobileSrc: "/assets/hero/hero-1-m.png", alt: "석연MRO 현장 1" },
  { src: "/assets/hero/hero-2.png", mobileSrc: "/assets/hero/hero-2-m.png", alt: "석연MRO 현장 2" },
  { src: "/assets/hero/hero-3.png", mobileSrc: "/assets/hero/hero-3-m.png", alt: "석연MRO 현장 3" },
  { src: "/assets/hero/hero-4.png", mobileSrc: "/assets/hero/hero-4-m.png", alt: "석연MRO 현장 4" },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((s) => (s + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-full min-h-65 overflow-hidden bg-[#f7f7f7]">
      {slides.map((s, i) => (
        <picture
          key={s.src}
          className="absolute inset-0 block h-full w-full transition-opacity duration-900 ease-in-out"
          style={{ opacity: active === i ? 1 : 0 }}
        >
          {/* md(768px) 이상: 데스크톱 이미지 / 미만: 모바일 이미지 */}
          <source media="(min-width: 768px)" srcSet={s.src} />
          <img src={s.mobileSrc} alt={s.alt} className="h-full w-full object-contain md:object-cover" />
        </picture>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,27,51,0.2))]" />
    </div>
  );
}
