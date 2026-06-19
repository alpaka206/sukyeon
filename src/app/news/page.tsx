import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import newsData from "@/content/news.json";

export const metadata: Metadata = { title: "공지사항" };

const items = newsData.items;

export default function NewsPage() {
  return (
    <>
      <PageHeader eyebrow="NEWS" title="공지사항" breadcrumb="홈 / 고객지원 / 공지사항" />
      <div className="shell py-16 pb-20">
        <div className="border-t-2 border-[#0a1b33]">
          {items.map((n, i) => (
            <div
              key={i}
              className="row-link flex cursor-pointer items-center gap-4 border-b border-[#eaeef3] px-2 py-6"
            >
              <span
                className="shrink-0 rounded-md px-2.5 py-[5px] text-[12px] font-bold"
                style={{
                  color: n.accent ? "#22409b" : "#5a6680",
                  background: n.accent ? "#eef2fc" : "#f1f5f9",
                }}
              >
                {n.category}
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
