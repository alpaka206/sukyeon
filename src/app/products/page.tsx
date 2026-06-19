import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionLayout from "@/components/SectionLayout";

export const metadata: Metadata = { title: "제품안내" };

const navItems = [
  { id: "p-release", label: "이형제" },
  { id: "p-pranza", label: "프란자오일" },
  { id: "p-hyd", label: "작동유 · 습동면유" },
  { id: "p-parts", label: "소모성 부자재" },
];

const releaseCans = [
  { code: "SR-800", img: "/assets/release_SR800.jpg" },
  { code: "SR-850", img: "/assets/release_SR850.jpg" },
  { code: "SR-900", img: "/assets/release_SR900.jpg" },
  { code: "SR-950", img: "/assets/release_SR950.jpg" },
  { code: "SR-1200", img: "/assets/release_SR1200.jpg" },
  { code: "ZM-12", img: "/assets/release_ZM12.jpg" },
];

const pranzaCans = [
  { code: "SL-600", img: "/assets/pranza_SL600.jpg" },
  { code: "SL-600M", img: "/assets/pranza_SL600M.jpg" },
  { code: "SL-600S", img: "/assets/pranza_SL600S.jpg" },
];

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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 font-extrabold text-[#22409b]">·</span>
      <span className="text-[15px] text-[#42526b]">{children}</span>
    </div>
  );
}

function CanGrid({ cans }: { cans: { code: string; img: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb] p-[18px]">
      {cans.map((c) => (
        <div key={c.code} className="rounded-xl border border-[#eef1f5] bg-white p-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.img} alt={c.code} className="aspect-square w-full object-contain" />
          <div className="pt-1 font-mono text-[12px] font-bold text-[#0a1b33]">{c.code}</div>
        </div>
      ))}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb] lg:h-[380px]">
      <span className="font-mono text-[12px] text-[#8a96ab]">{label}</span>
    </div>
  );
}

const eyebrowCls = "mb-3.5 font-mono text-[13px] tracking-[2px] text-[#22409b]";
const h2Cls = "m-0 mb-4 fs-3 font-extrabold tracking-[-0.8px] text-[#0a1b33]";
const pCls = "m-0 mb-6 text-[16px] leading-[1.8] text-[#5a6680]";

export default function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="PRODUCTS" title="제품안내" breadcrumb="홈 / 제품안내" />
      <SectionLayout eyebrow="PRODUCTS" title="제품안내" items={navItems}>
        {/* 이형제 */}
        <section id="p-release" className="spy-section grid grid-cols-1 items-center gap-10 shell py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <CanGrid cans={releaseCans} />
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
        </section>

        {/* 프란자오일 */}
        <section id="p-pranza" className="spy-section grid grid-cols-1 items-center gap-10 bg-[#f6f9fb] shell py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
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
            <CanGrid cans={pranzaCans} />
          </div>
        </section>

        {/* 작동유 */}
        <section id="p-hyd" className="spy-section grid grid-cols-1 items-center gap-10 shell py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Placeholder label="작동유 제품 이미지" />
          <div>
            <div className={eyebrowCls}>HYDRAULIC OIL</div>
            <h2 className={h2Cls}>작동유</h2>
            <p className={pCls}>
              다이캐스팅 설비용 유압 작동유. 안정적인 유압 전달과 산화 안정성으로 설비를 부드럽게 운전합니다.
            </p>
            <div className="mb-7 flex flex-col gap-3">
              <Bullet>우수한 산화·열 안정성으로 교환 주기 연장</Bullet>
              <Bullet>방청·소포성으로 설비 보호</Bullet>
              <Bullet>다양한 점도 등급 공급 가능</Bullet>
            </div>
            <MsdsLink />
          </div>
        </section>

        {/* 습동면유 */}
        <section id="p-slide" className="spy-section grid grid-cols-1 items-center gap-10 bg-[#f6f9fb] shell py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <div className="lg:order-1">
            <div className={eyebrowCls}>SLIDEWAY OIL</div>
            <h2 className={h2Cls}>습동면유</h2>
            <p className={pCls}>
              공작·다이캐스팅 설비의 습동면 윤활유. 스틱슬립을 방지하고 정밀 이송과 면 보호를 동시에 구현합니다.
            </p>
            <div className="mb-7 flex flex-col gap-3">
              <Bullet>우수한 점착성으로 습동면 유막 유지</Bullet>
              <Bullet>스틱슬립 방지로 정밀 이송 안정화</Bullet>
              <Bullet>작동유와의 분리성 우수</Bullet>
            </div>
            <MsdsLink />
          </div>
          <div className="lg:order-2">
            <Placeholder label="습동면유 제품 이미지" />
          </div>
        </section>

        {/* 소모성 부자재 */}
        <section id="p-parts" className="spy-section grid grid-cols-1 items-center gap-10 shell py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Placeholder label="부자재 이미지" />
          <div>
            <div className={eyebrowCls}>CONSUMABLES</div>
            <h2 className={h2Cls}>소모성 부자재</h2>
            <p className={pCls}>
              다이캐스팅 현장 운영에 필요한 소모성 부자재를 함께 공급합니다. 필요 품목을 한 곳에서 간편하게 조달하세요.
            </p>
            <div className="mb-7 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              <Bullet>도포 노즐 · 스프레이 부속</Bullet>
              <Bullet>필터 · 여과 자재</Bullet>
              <Bullet>호스 · 배관 부속</Bullet>
              <Bullet>기타 현장 운영 자재</Bullet>
            </div>
            <Link href="/contact" className="link-teal inline-flex items-center gap-2 text-[15px] font-bold text-[#22409b]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-6 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              부자재 견적 문의
            </Link>
          </div>
        </section>

        {/* product CTA */}
        <div className="shell pb-20">
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
