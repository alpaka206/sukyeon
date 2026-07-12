"use client";

import { useState, type KeyboardEvent } from "react";

import {
  nextSlideIndex,
  optimizedSanitySource,
  previousSlideIndex,
  shouldAnimateSlide,
} from "./heroCarouselState";

export type HeroSlide = {
  readonly src: string;
  readonly mobileSrc: string;
  readonly alt: string;
};

function ArrowIcon({ direction }: { readonly direction: "left" | "right" }) {
  const path = direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6";
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d={path} />
    </svg>
  );
}

export default function HeroCarousel({
  slides,
}: {
  readonly slides: readonly HeroSlide[];
}) {
  const [active, setActive] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  if (slides.length === 0) {
    return <div className="h-full min-h-65 bg-[#f7f7f7]" />;
  }

  const activeSlide = slides[active];
  if (activeSlide === undefined) {
    return <div className="h-full min-h-65 bg-[#f7f7f7]" />;
  }

  const selectSlide = (index: number) => {
    setHasInteracted(true);
    setActive(index);
  };
  const showPrevious = () => {
    setHasInteracted(true);
    setActive((current) => previousSlideIndex(current, slides.length));
  };
  const showNext = () => {
    setHasInteracted(true);
    setActive((current) => nextSlideIndex(current, slides.length));
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="현장 사진"
      onKeyDown={handleKeyDown}
      className="relative h-full min-h-65 overflow-hidden bg-[#f7f7f7]"
    >
      <picture
        key={activeSlide.src}
        className={`${
          shouldAnimateSlide(hasInteracted) ? "hero-slide-enter " : ""
        }absolute inset-0 block h-full w-full`}
      >
        <source
          media="(min-width: 768px)"
          srcSet={optimizedSanitySource(activeSlide.src, 900)}
        />
        <img
          src={optimizedSanitySource(activeSlide.mobileSrc, 420, 65, "webp")}
          alt={activeSlide.alt}
          width={1600}
          height={900}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-contain md:object-cover"
        />
      </picture>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,27,51,0.2))]" />
      {slides.length > 1 && (
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="이전 슬라이드"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-navy/75 text-white backdrop-blur-sm transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowIcon direction="left" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-navy/75 px-3 py-2 backdrop-blur-sm">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => selectSlide(index)}
                aria-label={`${index + 1}번 슬라이드: ${slide.alt}`}
                aria-current={active === index ? "true" : undefined}
                className="group flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    active === index
                      ? "bg-white"
                      : "bg-white/55 group-hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={showNext}
            aria-label="다음 슬라이드"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-navy/75 text-white backdrop-blur-sm transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {slides.length}개 중 {active + 1}번: {slides[active]?.alt}
      </p>
    </div>
  );
}
