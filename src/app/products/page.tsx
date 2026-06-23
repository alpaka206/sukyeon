import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import { ProductDetailSelector } from "@/components/ProductDetailSelector";
import SectionLayout from "@/components/SectionLayout";
import { pranzaProductDetails, releaseProductDetails } from "./productDetails";

export const metadata: Metadata = { title: "제품안내" };

const navItems = [
  { id: "p-release", label: "이형제" },
  { id: "p-pranza", label: "프란자오일" },
  { id: "p-etc-parts", label: "기타 부자재" },
  { id: "p-spray", label: "스프레이/사출제품" },
];

type ProductPhoto = {
  readonly src: string;
  readonly alt: string;
  readonly label: string;
};

type FeatureText = {
  readonly title: string;
  readonly desc: string;
};

const miscPhotos = [
  {
    src: "/assets/products/misc-tongs.jpg",
    alt: "다이캐스팅 현장용 집게 부자재",
    label: "집게 · 현장 공구",
  },
  {
    src: "/assets/products/misc-hardware.jpg",
    alt: "하드참바 노즐과 금속 부자재",
    label: "하드참바 · 노즐 부품",
  },
] satisfies readonly ProductPhoto[];

const sprayPhotos = [
  {
    src: "/assets/products/spray-cassette.jpg",
    alt: "스프레이 카세트와 노즐 부품",
    label: "스프레이 카세트",
  },
  {
    src: "/assets/products/spray-copper-pipes.jpg",
    alt: "스프레이용 동파이프 부품",
    label: "스프레이 동파이프",
  },
] satisfies readonly ProductPhoto[];

const miscHighlights = [
  { title: "열전대 · 커버", desc: "AL/Mg용 외장재, 씨스형 측온저항체, 주물·흑연·세라믹 커버" },
  { title: "레들 · 쪽자", desc: "0.15kg~30kg 레들, 특대·대·1호~8호 쪽자" },
  { title: "하드참바 부품", desc: "링구, 노즐바디, 노즐콘 등 교체 부품" },
  { title: "공정 보조재", desc: "다이코트, 라이닝제, 구리스, 세라믹코팅제, 집게, 탈산제, 탈가스제" },
] satisfies readonly FeatureText[];

const sprayHighlights = [
  { title: "스프레이건 · 카세트", desc: "BS형/L형 핸드 스프레이건, 블럭형·판재형 카세트" },
  { title: "노즐 · 동파이프", desc: "7구·12구 노즐, Ø5/Ø6/Ø8 스프레이 동파이프" },
  { title: "냉각로드 · 부싱", desc: "열처리/비열처리 냉각로드, 표면 열처리 부싱" },
  { title: "사출부품", desc: "기계 슬리브, 프란자 팁 Ø35~Ø150, 2분할·3분할 카프링" },
] satisfies readonly FeatureText[];

function DownloadSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function MsdsLink() {
  return (
    <Link href="/data" className="link-teal inline-flex items-center gap-2 text-[15px] font-bold text-[#22409b]">
      <DownloadSvg />
      MSDS · 시험성적서 다운로드
    </Link>
  );
}

function Bullet({ children }: { readonly children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 font-extrabold text-[#22409b]">·</span>
      <span className="text-[15px] text-[#42526b]">{children}</span>
    </div>
  );
}

function ProductPhotoStack({ images }: { readonly images: readonly ProductPhoto[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.1fr_0.9fr]">
      {images.map((image, index) => (
        <figure
          key={image.src}
          className="relative m-0 min-h-[230px] overflow-hidden rounded-[18px] border border-[#e2e6ed] bg-[#f6f9fb] sm:min-h-[360px]"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={index === 0 ? "(max-width: 768px) 100vw, 45vw" : "(max-width: 768px) 100vw, 36vw"}
            className="object-contain p-3"
          />
          <figcaption className="absolute bottom-3 left-3 rounded-[8px] bg-white/92 px-3 py-2 text-[13px] font-bold text-[#0a1b33] shadow-[0_12px_30px_-18px_rgba(10,27,51,0.45)]">
            {image.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function FeatureGrid({ items }: { readonly items: readonly FeatureText[] }) {
  return (
    <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-[14px] border border-[#e2e6ed] bg-white p-5">
          <h3 className="m-0 mb-2 text-[16px] font-extrabold text-[#0a1b33]">{item.title}</h3>
          <p className="m-0 text-[14.5px] leading-[1.65] text-[#5a6680]">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function InquiryLink({ children }: { readonly children: ReactNode }) {
  return (
    <Link href="/contact" className="link-teal inline-flex items-center gap-2 text-[15px] font-bold text-[#22409b]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 9V5a3 3 0 0 0-6 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {children}
    </Link>
  );
}

const eyebrowCls = "mb-3.5 font-mono text-[13px] tracking-[2px] text-[#22409b]";
const h2Cls = "m-0 mb-4 fs-3 font-extrabold tracking-[-0.8px] text-[#0a1b33]";
const pCls = "m-0 mb-6 text-[16px] leading-[1.8] text-[#5a6680]";

export default function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="PRODUCTS" title="제품안내" wide />
      <SectionLayout eyebrow="PRODUCTS" title="제품안내" items={navItems} wide>
        <section id="p-release" className="spy-section grid grid-cols-1 items-start gap-10 wide-shell py-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14 lg:py-20">
          <div>
            <div className={eyebrowCls}>RELEASE AGENT</div>
            <h2 className={h2Cls}>
              이형제 <span className="text-[18px] font-bold text-[#22409b]">CAST ONE</span>
            </h2>
            <p className={pCls}>
              알루미늄 다이캐스팅용 수성·유성 이형제. 우수한 이형성과 고온 안정성으로 소착과 표면 결함을 방지하고 생산성을 높입니다.
            </p>
            <div className="mb-7 flex flex-col gap-3">
              <Bullet><strong className="text-[#0a1b33]">수성 이형제</strong> — 희석형 수용성 타입, 쾌적한 작업 환경과 우수한 이형성</Bullet>
              <Bullet><strong className="text-[#0a1b33]">유성 이형제</strong> — 고온·고압 공정용, 안정적 피막 형성으로 소착 방지</Bullet>
              <Bullet>합금·금형·사이클 조건에 맞춘 맞춤 조성 설계 가능</Bullet>
            </div>
            <MsdsLink />
          </div>
          <ProductDetailSelector label="CAST ONE LINEUP" items={releaseProductDetails} />
        </section>

        <section id="p-pranza" className="spy-section grid grid-cols-1 items-start gap-10 bg-[#f6f9fb] wide-shell py-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14 lg:py-20">
          <div className="lg:order-1">
            <div className={eyebrowCls}>PLUNGER OIL</div>
            <h2 className={h2Cls}>
              프란자오일 <span className="text-[18px] font-bold text-[#22409b]">LUBE ONE</span>
            </h2>
            <p className={pCls}>
              플런저 슬리브 윤활용 프란자오일. 마찰을 줄여 사출 안정성을 확보하고 플런저·슬리브의 수명을 연장합니다.
            </p>
            <div className="mb-7 flex flex-col gap-3">
              <Bullet>고온 윤활 안정성으로 사출 불량 저감</Bullet>
              <Bullet>정량 도포에 적합한 점도 설계</Bullet>
              <Bullet>설비 수명 연장 및 유지보수 비용 절감</Bullet>
            </div>
            <MsdsLink />
          </div>
          <div className="lg:order-2">
            <ProductDetailSelector label="LUBE ONE LINEUP" items={pranzaProductDetails} />
          </div>
        </section>

        <section id="p-etc-parts" className="spy-section grid grid-cols-1 items-center gap-10 wide-shell py-16 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 lg:py-20">
          <ProductPhotoStack images={miscPhotos} />
          <div>
            <div className={eyebrowCls}>AUXILIARY PARTS</div>
            <h2 className={h2Cls}>기타 부자재</h2>
            <p className={pCls}>
              다이캐스팅 라인 운영에 필요한 열전대, 레들, 하드참바, 쪽자, 코팅·처리 자재를 함께 공급합니다. 설비 규격과 공정 조건에 맞춰 필요한 품목을 확인해 드립니다.
            </p>
            <FeatureGrid items={miscHighlights} />
            <InquiryLink>기타 부자재 견적 문의</InquiryLink>
          </div>
        </section>

        <section id="p-spray" className="spy-section grid grid-cols-1 items-center gap-10 bg-[#f6f9fb] wide-shell py-16 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14 lg:py-20">
          <div className="lg:order-1">
            <div className={eyebrowCls}>SPRAY & INJECTION PARTS</div>
            <h2 className={h2Cls}>스프레이/사출제품</h2>
            <p className={pCls}>
              이형제 도포와 사출부 유지보수에 필요한 스프레이건, 카세트, 노즐, 동파이프, 냉각로드, 슬리브, 프란자 팁을 공급합니다. 표준 규격뿐 아니라 비규격 제품도 상담 가능합니다.
            </p>
            <FeatureGrid items={sprayHighlights} />
            <InquiryLink>스프레이/사출제품 견적 문의</InquiryLink>
          </div>
          <div className="lg:order-2">
            <ProductPhotoStack images={sprayPhotos} />
          </div>
        </section>

        <div className="wide-shell pb-20">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[18px] bg-[#0a1b33] p-8 text-white sm:flex-row sm:items-center lg:p-[50px]">
            <div>
              <h3 className="m-0 mb-2 text-[22px] font-extrabold lg:text-[26px]">어떤 제품이 맞을지 고민되시나요?</h3>
              <p className="m-0 text-[15px] text-[#b6c3d6]">공정 조건을 알려주시면 최적의 제품을 추천해 드립니다.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 cursor-pointer rounded-[10px] bg-[#4f74e6] px-[30px] py-[15px] text-[16px] font-bold text-white transition-opacity hover:opacity-90"
            >
              맞춤 견적 받기
            </Link>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}
