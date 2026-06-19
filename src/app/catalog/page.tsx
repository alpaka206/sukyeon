import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import catalog from "@/content/catalog.json";

export const metadata: Metadata = { title: "카탈로그" };

export default function CatalogPage() {
  return (
    <>
      <PageHeader eyebrow="CATALOG" title="카탈로그" breadcrumb="홈 / 카탈로그" />

      <div className="grid grid-cols-1 items-center gap-10 shell py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="relative mx-auto flex aspect-[3/4] w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-[18px] bg-[linear-gradient(160deg,#13294a,#0a1b33)] p-[38px] text-white shadow-[0_30px_60px_-25px_rgba(10,27,51,0.55)]">
          <div className="relative text-[19px] font-extrabold tracking-[-0.3px]">
            석연<span className="text-[#4f74e6]">MRO</span>
          </div>
          <div className="relative">
            <div className="mb-2.5 font-mono text-[12px] tracking-[2px] text-[#4f74e6]">PRODUCT CATALOG</div>
            <div className="fs-4 font-extrabold leading-[1.25] tracking-[-0.6px]">{catalog.title}</div>
            <div className="mt-3 text-[14px] text-[#9fb0c9]">{catalog.tagline}</div>
          </div>
        </div>

        <div>
          <div className="mb-3.5 font-mono text-[13px] tracking-[2px] text-[#22409b]">DOWNLOAD</div>
          <h2 className="m-0 mb-[18px] fs-3 font-extrabold tracking-[-0.7px] text-[#0a1b33]">
            {catalog.title}
          </h2>
          <p className="m-0 mb-7 max-w-[520px] text-[16px] leading-[1.8] text-[#5a6680]">
            석연MRO의 다이캐스팅 이형제(CAST ONE), 프란자오일(LUBE ONE), 작동유·습동면유, 소모성 부자재 전 제품 정보를 한 권에 담았습니다. 온라인으로 열람하거나 PDF로 내려받으세요.
          </p>
          <div className="mb-[26px] flex items-center gap-2.5 text-[14px] text-[#8a96ab]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22409b" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            PDF 문서 · 석연MRO 제품 카탈로그
          </div>
          <div className="flex flex-wrap gap-3.5">
            <a
              href={catalog.file}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#22409b] px-7 py-[15px] text-[16px] font-bold text-white transition-colors hover:bg-[#18306f]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              온라인으로 보기
            </a>
            <a
              href={catalog.file}
              download
              className="btn-outline inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-[#d4dae4] px-7 py-[15px] text-[16px] font-bold text-[#0a1b33]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5M12 15V3" />
              </svg>
              PDF 다운로드
            </a>
          </div>
        </div>
      </div>

      <div className="shell pb-20">
        <div className="overflow-hidden rounded-2xl border border-[#eaeef3] bg-[#f6f9fb]">
          <iframe
            src={`${catalog.file}#view=FitH`}
            title="석연MRO 제품 카탈로그"
            className="h-[640px] w-full lg:h-[820px]"
          />
        </div>
        <p className="m-0 mt-[18px] text-[14px] text-[#8a96ab]">
          ※ 브라우저에서 PDF가 보이지 않으면 위 “온라인으로 보기” 또는 “PDF 다운로드”를 이용해 주세요.
        </p>
      </div>
    </>
  );
}
