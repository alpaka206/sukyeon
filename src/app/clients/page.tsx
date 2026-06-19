import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "고객사·실적" };

const stats = [
  { value: <>350<span className="text-[#22409b]">+</span></>, label: "누적 거래처" },
  { value: <>30<span className="text-[#22409b]">년+</span></>, label: "제조·공급 경력" },
  { value: <>전국</>, label: "납품 네트워크" },
];

const industries = ["자동차 부품", "전장·전자 부품", "산업기계", "건축·구조 부품", "일반 주조"];

export default function ClientsPage() {
  return (
    <>
      <PageHeader eyebrow="CLIENTS" title="고객사·실적" breadcrumb="홈 / 고객사·실적" />

      <div className="grid grid-cols-1 gap-[22px] shell py-16 sm:grid-cols-3 lg:py-[72px]">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl bg-[#f6f9fb] p-[34px] text-center">
            <div className="text-[42px] font-extrabold tracking-[-1px] text-[#0a1b33]">{s.value}</div>
            <div className="mt-2 text-[15px] text-[#5a6680]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="shell pb-10">
        <h2 className="m-0 mb-2.5 text-[24px] font-extrabold tracking-[-0.6px] text-[#0a1b33] lg:text-[26px]">
          주요 적용 산업
        </h2>
        <p className="m-0 mb-7 text-[15px] text-[#5a6680]">
          자동차 부품, 전장·전자, 산업기계 등 알루미늄 다이캐스팅이 필요한 다양한 산업 현장에 공급합니다.
        </p>
        <div className="flex flex-wrap gap-3">
          {industries.map((t) => (
            <span key={t} className="rounded-full bg-[#eef2fc] px-5 py-2.5 text-[15px] font-semibold text-[#0a1b33]">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="shell pb-20 pt-10">
        <h2 className="m-0 mb-7 text-[24px] font-extrabold tracking-[-0.6px] text-[#0a1b33] lg:text-[26px]">
          함께하는 고객사
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex h-[84px] items-center justify-center rounded-xl border border-[#eaeef3] bg-[#f6f9fb] text-[13px] text-[#aab4c5]"
            >
              고객사 로고
            </div>
          ))}
        </div>
        <p className="m-0 mt-5 text-[14px] text-[#8a96ab]">※ 고객사 로고는 자료 제공 후 게재 예정입니다.</p>
      </div>
    </>
  );
}
