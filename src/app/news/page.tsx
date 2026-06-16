import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "공지사항" };

type Item = { cat: string; title: string; date: string; accent: boolean };

const items: Item[] = [
  { cat: "자료", title: "작동유·습동면유 MSDS(GHS) 개정 안내", date: "2026.05.20", accent: true },
  { cat: "제품", title: "수성 이형제 신규 라인업 출시 안내", date: "2026.03.11", accent: true },
  { cat: "인증", title: "ISO 9001 품질경영시스템 갱신 완료", date: "2026.01.08", accent: true },
  { cat: "일반", title: "설 연휴 배송 및 고객지원 운영 안내", date: "2026.01.02", accent: false },
  { cat: "일반", title: "홈페이지 리뉴얼 오픈 안내", date: "2025.12.15", accent: false },
];

export default function NewsPage() {
  return (
    <>
      <PageHeader eyebrow="NEWS" title="공지사항" breadcrumb="홈 / 고객지원 / 공지사항" />
      <div className="px-5 py-16 pb-20 lg:px-[60px]">
        <div className="border-t-2 border-[#0a1b33]">
          {items.map((n, i) => (
            <div
              key={i}
              className="row-link flex cursor-pointer items-center gap-4 border-b border-[#eaeef3] px-2 py-6"
            >
              <span
                className="shrink-0 rounded-md px-2.5 py-[5px] text-[12px] font-bold"
                style={{
                  color: n.accent ? "#0a8499" : "#5a6680",
                  background: n.accent ? "#e9f8fb" : "#f1f5f9",
                }}
              >
                {n.cat}
              </span>
              <span className="flex-1 text-[16px] font-semibold text-[#0a1b33] sm:text-[17px]">{n.title}</span>
              <span className="shrink-0 font-mono text-[13px] text-[#8a96ab]">{n.date}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-2">
          {["1", "2", "3"].map((p, i) => (
            <span
              key={p}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-lg text-[14px] font-semibold"
              style={
                i === 0
                  ? { background: "#0a1b33", color: "#fff", fontWeight: 700 }
                  : { border: "1px solid #e2e6ed", color: "#5a6680", cursor: "pointer" }
              }
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
