import type { ReactNode } from "react";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import { ProductImageCard } from "@/components/ProductCards";
import { safeContentHref } from "@/lib/adminUrl";
import { getHomePage } from "@/lib/content";

const WHY_ICONS: Record<string, ReactNode> = {
  manufacturing: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  quality: (
    <>
      <path d="M9 12l2 2 4-4" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M12 22c4.97 0 9-1.34 9-3V5c0-1.66-4.03-3-9-3S3 3.34 3 5v14c0 1.66 4.03 3 9 3z" />
    </>
  ),
  delivery: (
    <>
      <path d="M5 17h-2v-6l2-5h9l4 5h2a1 1 0 0 1 1 1v5h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </>
  ),
  support: (
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
};

function MultiLine({ text }: { readonly text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={line}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

function keepTogether(text: string): string {
  return ["전문 생산", "최상의 제품"].reduce(
    (result, phrase) => result.replaceAll(phrase, phrase.replaceAll(" ", "\u00a0")),
    text,
  );
}

export default async function Home() {
  const home = await getHomePage();
  if (!home) return null;
  const { hero, productsHeading, productCards, productsCta, whyHeading, whyItems, contactCta } = home;
  const slides = hero.slides.map((s) => ({ src: s.desktop, mobileSrc: s.mobile, alt: s.alt }));

  return (
    <>
      {/* hero */}
      <section className="wide-shell grid grid-cols-1 lg:min-h-140 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
        <div className="flex flex-col justify-center py-15 lg:py-22.5 lg:pr-8 xl:pr-10">
          <h1 className="m-0 mb-6.5 fs-hero font-bold leading-[1.32] tracking-[-1px] text-navy">
            <span className="hero-title-line">{hero.titleLine1}</span>
            <span className="hero-title-line text-[#22409b]">{hero.titleLine2}</span>
          </h1>
          <p className="hero-copy m-0 mb-9.5 max-w-[300px] leading-[1.82] text-[#5a6680] text-pretty sm:max-w-190">
            <span className="hero-copy-line">{keepTogether(hero.copyLine1)}</span>
            <span className="hero-copy-line">{keepTogether(hero.copyLine2)}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href={safeContentHref(hero.primaryHref)}
              prefetch={false}
              className="cursor-pointer rounded-[10px] bg-brand px-7.5 py-3.75 text-[16px] font-bold text-white transition-colors hover:bg-brand-deep"
            >
              {hero.primaryLabel}
            </Link>
            <Link
              href={safeContentHref(hero.secondaryHref)}
              prefetch={false}
              className="cursor-pointer rounded-[10px] border-2 border-[#22409b] px-7.5 py-3.75 text-[16px] font-bold text-[#22409b] transition-colors hover:bg-[#22409b] hover:text-white"
            >
              {hero.secondaryLabel}
            </Link>
          </div>
        </div>
        <div className="order-first h-65 sm:h-90 lg:order-0 lg:h-auto">
          <HeroCarousel slides={slides} />
        </div>
      </section>

      {/* products preview */}
      <section className="bg-white shell py-16 lg:py-22">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="m-0 fs-2 font-extrabold tracking-[-1px] text-navy">{productsHeading.title}</h2>
          <Link href={safeContentHref(productsHeading.moreHref)} prefetch={false} className="link-teal shrink-0 cursor-pointer text-[15px] font-bold text-[#22409b]">
            {productsHeading.moreLabel}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          {productCards.map((c) => (
            <ProductImageCard key={c.title} href={c.href} img={c.image} alt={c.title} title={c.title} tag={c.tag || undefined} desc={c.desc} />
          ))}
          <div className="flex flex-col justify-center overflow-hidden rounded-2xl bg-navy p-7.5 text-white">
            <h3 className="m-0 mb-2.5 text-[21px] font-extrabold leading-[1.4]">
              <MultiLine text={productsCta.title} />
            </h3>
            <p className="m-0 mb-5 text-[14px] leading-[1.6] text-[#b6c3d6]">{productsCta.desc}</p>
            <Link
              href={safeContentHref(productsCta.href)}
              prefetch={false}
              className="w-fit cursor-pointer rounded-[9px] bg-brand px-5 py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              {productsCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* why us */}
      <section className="bg-[#f6f9fb] shell py-16 lg:py-22">
        <h2 className="m-0 mb-12 fs-2 font-extrabold tracking-[-1px] text-navy">{whyHeading.title}</h2>
        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {whyItems.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#eaeef3] bg-white p-5 lg:px-7 lg:py-8">
              <div className="mb-2.5 flex items-center gap-3 lg:mb-3 lg:block">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-brand-soft lg:mb-5 lg:h-12.5 lg:w-12.5 lg:rounded-[13px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22409b" strokeWidth="2">
                    {WHY_ICONS[f.icon] ?? WHY_ICONS.manufacturing}
                  </svg>
                </div>
                <h3 className="m-0 text-[15px] font-bold lg:text-[18px]">{f.title}</h3>
              </div>
              <p className="m-0 text-[13px] leading-[1.55] text-[#5a6680] lg:text-[14.5px] lg:leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shell py-16 lg:py-22">
        <div className="mx-auto max-w-160 overflow-hidden rounded-[18px] bg-navy p-10 text-white">
          <h3 className="m-0 mb-3.5 text-[26px] font-extrabold leading-[1.35]">
            <MultiLine text={contactCta.title} />
          </h3>
          <p className="m-0 mb-6.5 text-[15px] leading-[1.6] text-[#b6c3d6]">{contactCta.desc}</p>
          <div className="flex flex-col gap-2.5">
            <Link
              href={safeContentHref(contactCta.primaryHref)}
              prefetch={false}
              className="cursor-pointer rounded-[10px] bg-brand px-6 py-3.5 text-center text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              {contactCta.primaryLabel}
            </Link>
            <a
              href={safeContentHref(contactCta.phoneHref)}
              className="rounded-[10px] border-[1.5px] border-white/25 px-6 py-3.5 text-center text-[15px] font-bold text-white"
            >
              {contactCta.phoneLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
