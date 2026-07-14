"use client";

import { useEffect, useState } from "react";

import {
  HERO_CAROUSEL_FADE_MS,
  HERO_CAROUSEL_AUTOPLAY_MS,
  nextSlideIndex,
  optimizedSanitySource,
  shouldAutoplaySlides,
} from "./heroCarouselState";

export type HeroSlide = {
  readonly src: string;
  readonly mobileSrc: string;
  readonly alt: string;
};

type CarouselState = {
  readonly active: number;
  readonly previous: number | null;
};

export default function HeroCarousel({
  slides,
}: {
  readonly slides: readonly HeroSlide[];
}) {
  const [carousel, setCarousel] = useState<CarouselState>({
    active: 0,
    previous: null,
  });
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!shouldAutoplaySlides(slides.length, paused || reduceMotion)) {
      return;
    }

    const timer = window.setInterval(() => {
      setCarousel((current) => {
        const active =
          current.active < slides.length ? current.active : 0;
        const next = nextSlideIndex(active, slides.length);
        return { active: next, previous: active };
      });
    }, HERO_CAROUSEL_AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  useEffect(() => {
    if (carousel.previous === null) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCarousel((current) => ({ ...current, previous: null }));
    }, HERO_CAROUSEL_FADE_MS);

    return () => window.clearTimeout(timer);
  }, [carousel.previous]);

  if (slides.length === 0) {
    return <div className="h-full min-h-65 bg-[#f7f7f7]" />;
  }

  const active = carousel.active < slides.length ? carousel.active : 0;
  const previous =
    carousel.previous !== null && carousel.previous < slides.length
      ? carousel.previous
      : null;
  const activeSlide = slides[active];
  if (activeSlide === undefined) {
    return <div className="h-full min-h-65 bg-[#f7f7f7]" />;
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="현장 사진"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-full min-h-65 overflow-hidden bg-[#f7f7f7]"
    >
      {slides.map((slide, index) => {
        const isActive = active === index;
        const isPrevious = previous === index && !isActive;
        const motionClass = isActive
          ? previous === null
            ? "z-10 opacity-100"
            : "hero-slide-fade-in z-10"
          : isPrevious
            ? "hero-slide-fade-out z-20"
            : "z-0 opacity-0";

        return (
          <picture
            key={slide.src}
            className={`absolute inset-0 block h-full w-full ${motionClass}`}
          >
            <source
              media="(min-width: 768px)"
              srcSet={optimizedSanitySource(slide.src, 900)}
            />
            <img
              src={optimizedSanitySource(slide.mobileSrc, 420, 65, "webp")}
              alt={isActive ? slide.alt : ""}
              width={1600}
              height={900}
              decoding="async"
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              className="h-full w-full object-contain md:object-cover"
            />
          </picture>
        );
      })}
      <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(180deg,transparent_55%,rgba(10,27,51,0.2))]" />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {activeSlide.alt}
      </p>
    </div>
  );
}
