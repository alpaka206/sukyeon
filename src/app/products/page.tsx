import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import { ProductGallery, type GalleryItem } from "@/components/ProductGallery";
import SectionLayout from "@/components/SectionLayout";
import { pranzaProductDetails, releaseProductDetails } from "./productDetails";

export const metadata: Metadata = { title: "제품소개" };

const navItems = [
  { id: "p-release", label: "이형제" },
  { id: "p-pranza", label: "프란자오일" },
  { id: "p-machine-parts", label: "사출 부품" },
  { id: "p-spray", label: "스프레이 부품" },
  { id: "p-crucible", label: "용탕 관리제품" },
];

const machineParts = [
  { image: "/assets/products/machine-parts/coolingrod.png", title: "냉각로드", summary: "열처리·비열처리 냉각로드" },
  { image: "/assets/products/machine-parts/sleeve.png", title: "기계 슬리브", summary: "다이캐스팅 슬리브" },
  { image: "/assets/products/machine-parts/bushing.png", title: "부싱", summary: "표면 열처리 부싱" },
  { image: "/assets/products/machine-parts/hardchamba.png", title: "하드참바 노즐", summary: "노즐바디 · 노즐콘" },
  { image: "/assets/products/machine-parts/ring.png", title: "링구", summary: "하드참바 링구" },
  { image: "/assets/products/machine-parts/pranzatip.png", title: "프란자 팁", summary: "Ø35~Ø150 프란자 팁" },
  { image: "/assets/products/machine-parts/tip.png", title: "팁", summary: "플런저 팁" },
  { image: "/assets/products/machine-parts/coupling.png", title: "카프링", summary: "2분할 · 3분할 카프링" },
  { image: "/assets/products/machine-parts/oilpump.png", title: "오일펌프", summary: "윤활 오일펌프" },
] satisfies readonly GalleryItem[];

const crucibleTools = [
  { image: "/assets/products/crucible/thermocouple.png", title: "열전대 · 커버", summary: "씨스형 측온저항체 · 세라믹 커버" },
  { image: "/assets/products/crucible/ladle.png", title: "레들", summary: "0.15kg~30kg 레들" },
  { image: "/assets/products/crucible/jokja.png", title: "쪽자", summary: "특대 · 대 · 1호~8호 쪽자" },
  { image: "/assets/products/crucible/tongs.png", title: "집게", summary: "현장용 집게" },
  { image: "/assets/products/crucible/shovel.png", title: "삽", summary: "탕면 정리용 삽" },
] satisfies readonly GalleryItem[];

const sprayParts = [
  { image: "/assets/products/spray/gun.png", title: "스프레이건", summary: "BS형 · L형 핸드 스프레이건" },
  { image: "/assets/products/spray/cassette.png", title: "블럭형 카세트", summary: "블럭형 스프레이 카세트" },
  { image: "/assets/products/spray/cassette-plate.png", title: "판재형 카세트", summary: "판재형 스프레이 카세트" },
  { image: "/assets/products/spray/nozzle.png", title: "노즐 · 분사노즐", summary: "7구 · 12구 스프레이 노즐" },
  { image: "/assets/products/spray/mixing-valve.png", title: "도시바 믹싱밸브", summary: "도시바 믹싱밸브" },
  { image: "/assets/products/spray/copperpipe.png", title: "동파이프", summary: "Ø5 · Ø6 · Ø8 스프레이 동파이프" },
] satisfies readonly GalleryItem[];

const releaseGalleryItems: GalleryItem[] = releaseProductDetails.map((detail) => ({
  image: detail.image,
  title: detail.code,
  summary: detail.summary,
  points: detail.points,
  documents: detail.documents,
}));

const pranzaGalleryItems: GalleryItem[] = pranzaProductDetails.map((detail) => ({
  image: detail.image,
  title: detail.code,
  summary: detail.summary,
  points: detail.points,
  documents: detail.documents,
}));

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

const eyebrowCls = "mb-3.5 font-mono text-[13px] tracking-[2px] text-[#22409b]";
const h2Cls = "m-0 mb-4 fs-3 font-extrabold tracking-[-0.8px] text-navy";
const pCls = "m-0 mb-6 text-[16px] leading-[1.8] text-[#5a6680]";

export default function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="PRODUCTS" title="제품소개" wide />
      <SectionLayout eyebrow="PRODUCTS" title="제품소개" items={navItems} wide>
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
              <Bullet><strong className="text-navy">수성 이형제</strong> — 희석형 수용성 타입, 쾌적한 작업 환경과 우수한 이형성</Bullet>
              <Bullet><strong className="text-navy">유성 이형제</strong> — 고온·고압 공정용, 안정적 피막 형성으로 소착 방지</Bullet>
              <Bullet>합금·금형·사이클 조건에 맞춘 맞춤 조성 설계 가능</Bullet>
            </div>
            <MsdsLink />
          </div>
          <ProductGallery groupLabel="이형제 CAST ONE" variant="panel" items={releaseGalleryItems} />
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
            <ProductGallery groupLabel="프란자오일 LUBE ONE" variant="panel" items={pranzaGalleryItems} />
          </div>
        </section>

        <section id="p-machine-parts" className="spy-section wide-shell py-16 lg:py-20">
          <div className="mb-9 max-w-220">
            <div className={eyebrowCls}>INJECTION PARTS</div>
            <h2 className={h2Cls}>사출 부품</h2>
            <p className={pCls}>
              사출부 유지보수에 필요한 냉각로드, 슬리브, 부싱, 하드참바, 프란자 팁 등 정밀 가공 부품을 공급합니다.
              <br />
              표준 규격뿐 아니라 비규격 제품도 상담 가능합니다.
            </p>
          </div>
          <ProductGallery groupLabel="사출 부품" items={machineParts} />
        </section>

        <section id="p-spray" className="spy-section bg-[#f6f9fb] wide-shell py-16 lg:py-20">
          <div className="mb-9 max-w-220">
            <div className={eyebrowCls}>SPRAY PARTS</div>
            <h2 className={h2Cls}>스프레이 부품</h2>
            <p className={pCls}>
              이형제 도포에 필요한 스프레이건, 카세트, 노즐, 동파이프, 믹싱밸브를 공급합니다.
              <br />
              표준 규격뿐 아니라 비규격 제품도 상담 가능합니다.
            </p>
          </div>
          <ProductGallery groupLabel="스프레이 부품" items={sprayParts} />
        </section>

        <section id="p-crucible" className="spy-section wide-shell py-16 lg:py-20">
          <div className="mb-9 max-w-220">
            <div className={eyebrowCls}>MOLTEN METAL HANDLING</div>
            <h2 className={h2Cls}>용탕 관리제품</h2>
            <p className={pCls}>
              용탕 계량·이송·측온에 필요한 레들, 쪽자, 열전대, 집게, 삽 등 현장 공구를 함께 공급합니다.
              <br />
              설비 규격과 공정 조건에 맞춰 필요한 품목을 확인해 드립니다.
            </p>
          </div>
          <ProductGallery groupLabel="용탕 관리제품" items={crucibleTools} />
        </section>

        <div className="wide-shell pb-20">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[18px] bg-navy p-8 text-white sm:flex-row sm:items-center lg:p-12.5">
            <div>
              <h3 className="m-0 mb-2 text-[22px] font-extrabold lg:text-[26px]">어떤 제품이 맞을지 고민되시나요?</h3>
              <p className="m-0 text-[15px] text-[#b6c3d6]">공정 조건을 알려주시면 최적의 제품을 추천해 드립니다.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 cursor-pointer rounded-[10px] bg-[#4f74e6] px-7.5 py-3.75 text-[16px] font-bold text-white transition-opacity hover:opacity-90"
            >
              맞춤 견적 받기
            </Link>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}
