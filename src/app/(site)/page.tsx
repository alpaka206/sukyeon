import type { ReactNode } from "react";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import { ProductImageCard } from "@/components/ProductCards";
import { getHomePage, getNews } from "@/lib/content";

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

export default async function Home() {
  const [home, news] = await Promise.all([getHomePage(), getNews()]);
  if (!home) return null;
  const { hero, productsHeading, productCards, productsCta, whyHeading, whyItems, contactCta } = home;
  const slides = hero.slides.map((s) => ({ src: s.desktop, mobileSrc: s.mobile, alt: s.alt }));
  const latestNews = news.slice(0, 3);

  return (
    <>
      {/* hero */}
      <section className="wide-shell grid grid-cols-1 lg:min-h-140 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
        <div className="flex flex-col justify-center bg-[#fbfcfe] py-15 lg:py-22.5 lg:pr-8 xl:pr-10">
          <h1 className="m-0 mb-6.5 fs-hero font-bold leading-[1.32] tracking-[-1px] text-navy">
            <span className="hero-title-line">{hero.titleLine1}</span>
            <span className="hero-title-line text-[#22409b]">{hero.titleLine2}</span>
          </h1>
          <p className="hero-copy m-0 mb-9.5 max-w-190 leading-[1.82] text-[#5a6680] text-pretty">
            <span className="hero-copy-line">{hero.copyLine1}</span>
            <span className="hero-copy-line">{hero.copyLine2}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href={hero.primaryHref}
              className="cursor-pointer rounded-[10px] bg-brand px-7.5 py-3.75 text-[16px] font-bold text-white transition-colors hover:bg-brand-deep"
            >
              {hero.primaryLabel}
            </Link>
            <Link
              href={hero.secondaryHref}
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
          <div>
            <div className="mb-3.5 text-[13px] font-bold tracking-[1px] text-[#22409b]">{productsHeading.eyebrow}</div>
            <h2 className="m-0 fs-2 font-extrabold tracking-[-1px] text-navy">{productsHeading.title}</h2>
          </div>
          <Link href={productsHeading.moreHref} className="link-teal shrink-0 cursor-pointer text-[15px] font-bold text-[#22409b]">
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
              href={productsCta.href}
              className="w-fit cursor-pointer rounded-[9px] bg-[#4f74e6] px-5 py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              {productsCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* why us */}
      <section className="bg-[#f6f9fb] shell py-16 lg:py-22">
        <div className="mb-3.5 text-[13px] font-bold tracking-[1px] text-[#22409b]">{whyHeading.eyebrow}</div>
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

      {/* news + cta */}
      <section className="grid grid-cols-1 items-start gap-10 bg-white shell py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-22">
        <div>
          <div className="mb-7 flex items-end justify-between">
            <h2 className="m-0 fs-4 font-extrabold tracking-[-0.6px] text-navy">공지사항</h2>
            <Link href="/news" className="link-teal cursor-pointer text-[14px] font-bold text-[#22409b]">
              전체 보기 →
            </Link>
          </div>
          <div className="border-t border-[#eaeef3]">
            {latestNews.map((n) => (
              <Link
                key={n.title}
                href={`/news/${n.slug}`}
                className="row-link flex items-center justify-between border-b border-[#eaeef3] px-2 py-5"
              >
                <span className="text-[15px] font-semibold text-navy sm:text-[16px]">{n.title}</span>
                <span className="ml-3 shrink-0 font-mono text-[13px] text-[#8a96ab]">{n.date}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[18px] bg-navy p-10 text-white">
          <h3 className="m-0 mb-3.5 text-[26px] font-extrabold leading-[1.35]">
            <MultiLine text={contactCta.title} />
          </h3>
          <p className="m-0 mb-6.5 text-[15px] leading-[1.6] text-[#b6c3d6]">{contactCta.desc}</p>
          <div className="flex flex-col gap-2.5">
            <Link
              href={contactCta.primaryHref}
              className="cursor-pointer rounded-[10px] bg-[#4f74e6] px-6 py-3.5 text-center text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              {contactCta.primaryLabel}
            </Link>
            <a
              href={contactCta.phoneHref}
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
