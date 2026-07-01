import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import { ProductIconCard, ProductImageCard } from "@/components/ProductCards";
import { getNews } from "@/lib/content";

const metrics = [
  { label: "제조 경력", value: "30년+", brand: false },
  { label: "누적 거래처", value: "350+", brand: false },
  { label: "취급 품목", value: "4개 분야", brand: false },
  { label: "설립", value: "1996년", brand: true },
];

const whyUs = [
  {
    title: "자체 기술 제조",
    desc: "이형제·오일류를 직접 개발·배합. 공정에 맞춰 조성을 제안합니다.",
    icon: (
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    ),
  },
  {
    title: "균일한 품질",
    desc: "로트별 품질 관리로 항상 일정한 성능을 보장합니다.",
    icon: (
      <>
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M12 22c4.97 0 9-1.34 9-3V5c0-1.66-4.03-3-9-3S3 3.34 3 5v14c0 1.66 4.03 3 9 3z" />
      </>
    ),
  },
  {
    title: "신속한 납품",
    desc: "재고 운영과 물류망으로 긴급 발주에도 빠르게 대응합니다.",
    icon: (
      <>
        <path d="M5 17h-2v-6l2-5h9l4 5h2a1 1 0 0 1 1 1v5h-2" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </>
    ),
  },
  {
    title: "밀착 기술 지원",
    desc: "현장 도포 조건과 불량 개선까지 엔지니어가 함께합니다.",
    icon: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
  },
];

export default async function Home() {
  const news = (await getNews()).slice(0, 3);
  return (
    <>
      {/* hero */}
      <section className="wide-shell grid grid-cols-1 lg:min-h-140 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
        <div className="flex flex-col justify-center bg-[#fbfcfe] py-15 lg:py-22.5 lg:pr-8 xl:pr-10">
          <h1 className="m-0 mb-6.5 fs-hero font-bold leading-[1.32] tracking-[-1px] text-navy">
            <span className="hero-title-line">최고의 기술과 설비로 신뢰를 더하는</span>
            <span className="hero-title-line text-[#22409b]">다이캐스팅 소모품 전문 제조 기업</span>
          </h1>
          <p className="hero-copy m-0 mb-9.5 max-w-190 leading-[1.82] text-[#5a6680] text-pretty">
            <span className="hero-copy-line">
              이형제 · 프란자오일 · 소모성 부자재를{" "}
              <strong className="font-bold text-navy">전문 생산 공급</strong>합니다.
            </span>
            <span className="hero-copy-line">
              다이캐스팅 공정의 생산성과 품질을 향상시키는 최상의 제품을 생산합니다.
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/products"
              className="cursor-pointer rounded-[10px] bg-brand px-7.5 py-3.75 text-[16px] font-bold text-white transition-colors hover:bg-brand-deep"
            >
              제품 살펴보기
            </Link>
            <Link
              href="/data"
              className="cursor-pointer rounded-[10px] border-2 border-[#22409b] px-7.5 py-3.75 text-[16px] font-bold text-[#22409b] transition-colors hover:bg-[#22409b] hover:text-white"
            >
              MSDS 자료실
            </Link>
          </div>
        </div>
        <div className="order-first h-65 sm:h-90 lg:order-0 lg:h-auto">
          <HeroCarousel />
        </div>
      </section>

      {/* metric line */}
      <section className="grid grid-cols-2 shell border-t border-b border-[#eaeef3] lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="border-[#eaeef3] py-8.5 pr-5 lg:pr-10 not-nth-[2n+1]:pl-5 lg:not-nth-[4n+1]:pl-10 not-nth-[2n]:border-r nth-[-n+2]:border-b lg:not-last:border-r lg:nth-[-n+2]:border-b-0"
          >
            <div className="mb-2 text-[14px] font-semibold text-[#8a96ab]">{m.label}</div>
            <div
              className="text-[28px] font-extrabold tracking-[-0.5px] lg:text-[32px]"
              style={{ color: m.brand ? "#22409b" : "#0a1b33" }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </section>

      {/* products preview */}
      <section className="bg-white shell py-16 lg:py-22">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3.5 text-[13px] font-bold tracking-[1px] text-[#22409b]">
              PRODUCTS
            </div>
            <h2 className="m-0 fs-2 font-extrabold tracking-[-1px] text-navy">
              생산하는 제품
            </h2>
          </div>
          <Link href="/products" className="link-teal shrink-0 cursor-pointer text-[15px] font-bold text-[#22409b]">
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          <ProductImageCard href="/products#p-release" img="/assets/release_SR950.png" alt="CAST ONE 이형제" title="이형제" tag="CAST ONE" desc="수성·유성 다이캐스팅 이형제. 우수한 이형성과 고온 안정성." />
          <ProductImageCard href="/products#p-pranza" img="/assets/pranza_SL600.png" alt="LUBE ONE 프란자오일" title="프란자오일" tag="LUBE ONE" desc="플런저 윤활용 프란자오일. 사출 안정성과 설비 수명 향상." />
          <ProductIconCard href="/products#p-etc-parts" title="기타 부자재" desc="열전대·레들·하드참바·쪽자 등 공정 부자재를 함께 공급합니다.">
            <path d="M4 7h16M7 7v12M17 7v12M6 19h12" />
            <path d="M8 4h8l1 3H7l1-3z" />
            <path d="M10 11h4M10 15h4" />
          </ProductIconCard>
          <ProductIconCard href="/products#p-spray" title="스프레이/사출제품" desc="스프레이건·카세트·노즐·동파이프·프란자 팁을 공급합니다.">
            <path d="M4 16h6l8-8" />
            <path d="M14 8l2 2 4-4-2-2-4 4z" />
            <path d="M3 18h7M12 14l5 5" />
          </ProductIconCard>
          <Link href="/data" className="card-link overflow-hidden rounded-2xl border border-[#e2e6ed] bg-white">
            <div className="flex h-40 items-center justify-center bg-[#22409b]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <div className="p-6.5">
              <h3 className="m-0 mb-2 text-[20px] font-bold">MSDS · 기술 자료</h3>
              <p className="m-0 text-[15px] leading-[1.6] text-[#5a6680]">
                전 제품 MSDS(GHS)와 시험성적서를 자료실에서 제공합니다.
              </p>
            </div>
          </Link>
          <div className="flex flex-col justify-center overflow-hidden rounded-2xl bg-navy p-7.5 text-white">
            <h3 className="m-0 mb-2.5 text-[21px] font-extrabold leading-[1.4]">
              우리 공정에 맞는
              <br />
              제품을 찾으세요?
            </h3>
            <p className="m-0 mb-5 text-[14px] leading-[1.6] text-[#b6c3d6]">
              합금·금형·사이클을 알려주시면 맞춤 추천해 드립니다.
            </p>
            <Link
              href="/contact"
              className="w-fit cursor-pointer rounded-[9px] bg-[#4f74e6] px-5 py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              맞춤 견적 받기
            </Link>
          </div>
        </div>
      </section>

      {/* why us */}
      <section className="bg-[#f6f9fb] shell py-16 lg:py-22">
        <div className="mb-3.5 text-[13px] font-bold tracking-[1px] text-[#22409b]">
          WHY SUKYEON MRO
        </div>
        <h2 className="m-0 mb-12 fs-2 font-extrabold tracking-[-1px] text-navy">
          현장이 신뢰하는 이유
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#eaeef3] bg-white px-7 py-8">
              <div className="mb-5 flex h-12.5 w-12.5 items-center justify-center rounded-[13px] bg-brand-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22409b" strokeWidth="2">
                  {f.icon}
                </svg>
              </div>
              <h3 className="m-0 mb-2.5 text-[18px] font-bold">{f.title}</h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-[#5a6680]">{f.desc}</p>
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
            {news.map((n) => (
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
            견적·기술 상담
            <br />
            지금 문의하세요
          </h3>
          <p className="m-0 mb-6.5 text-[15px] leading-[1.6] text-[#b6c3d6]">
            24시간 내 담당자가 회신드립니다.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/contact"
              className="cursor-pointer rounded-[10px] bg-[#4f74e6] px-6 py-3.5 text-center text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              온라인 견적 문의
            </Link>
            <a
              href="tel:032-575-2492"
              className="rounded-[10px] border-[1.5px] border-white/25 px-6 py-3.5 text-center text-[15px] font-bold text-white"
            >
              전화 032-575-2492
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
