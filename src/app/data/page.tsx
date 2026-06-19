import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import docsData from "@/content/docs.json";

export const metadata: Metadata = { title: "자료실 (MSDS)" };

const rows = docsData.items;
const cols = "grid-cols-[70px_1fr_160px_130px_130px]";

export default function DataPage() {
  return (
    <>
      <PageHeader eyebrow="DATA / MSDS (GHS)" title="자료실" breadcrumb="홈 / 자료실(MSDS)" />
      <div className="shell py-16">
        <p className="m-0 mb-8 max-w-[760px] text-[16px] leading-[1.7] text-[#5a6680]">
          전 제품의 물질안전보건자료(MSDS·GHS)와 시험성적서를 제공합니다. 필요한 자료를 내려받으시거나, 추가 자료가 필요하시면 고객지원으로 문의해 주세요.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-[#eaeef3]">
          <div className="min-w-[680px]">
            <div className={`grid ${cols} bg-[#0a1b33] text-[14px] font-bold text-white`}>
              <div className="px-5 py-[18px]">번호</div>
              <div className="px-3 py-[18px]">자료명</div>
              <div className="px-3 py-[18px]">분류</div>
              <div className="px-3 py-[18px]">등록일</div>
              <div className="px-3 py-[18px] text-center">다운로드</div>
            </div>
            {rows.map((r, i) => (
              <div
                key={i}
                className={`grid ${cols} items-center text-[15px]`}
                style={{
                  background: i % 2 === 1 ? "#fbfcfe" : "#fff",
                  borderBottom: i < rows.length - 1 ? "1px solid #eef1f5" : "none",
                }}
              >
                <div className="p-5 font-mono text-[#8a96ab]">
                  {String(rows.length - i).padStart(2, "0")}
                </div>
                <div className="px-3 py-5 font-semibold text-[#0a1b33]">{r.name}</div>
                <div className="px-3 py-5 text-[#5a6680]">{r.category}</div>
                <div className="px-3 py-5 font-mono text-[13px] text-[#8a96ab]">{r.date}</div>
                <div className="px-3 py-5 text-center">
                  {r.file ? (
                    <a
                      href={r.file}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-bold text-[#22409b]"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      PDF
                    </a>
                  ) : (
                    <span className="text-[13px] text-[#aab4c5]">준비중</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="m-0 mt-5 text-[14px] text-[#8a96ab]">
          ※ 자료 목록과 PDF 파일은 관리자 페이지에서 등록·교체할 수 있습니다.
        </p>
      </div>
    </>
  );
}
