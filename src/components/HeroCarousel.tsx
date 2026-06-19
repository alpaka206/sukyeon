"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/assets/hero_01.jpg", alt: "석연MRO 현장 1" },
  { src: "/assets/hero_02.jpg", alt: "석연MRO 현장 2" },
  { src: "/assets/hero_03.jpg", alt: "석연MRO 현장 3" },
  { src: "/assets/hero_04.jpg", alt: "석연MRO 현장 4" },
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
    <div className="relative h-full min-h-[260px] overflow-hidden bg-[#0a1b33]">
      {slides.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: active === i ? 1 : 0 }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,27,51,0.4))]" />
      <div className="absolute bottom-[22px] left-0 right-0 z-[2] flex justify-center gap-[9px]">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`슬라이드 ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-[9px] rounded-full transition-all duration-300"
            style={{
              width: active === i ? 26 : 9,
              background: active === i ? "#4f74e6" : "rgba(255,255,255,0.55)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
