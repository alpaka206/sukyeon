import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getDocs } from "@/lib/content";

export const metadata: Metadata = { title: "자료실 (MSDS)" };

const cols = "grid-cols-[64px_minmax(260px,1fr)_150px_124px_120px]";
const pageSize = 10;

type Props = {
  readonly searchParams?: Promise<{
    readonly page?: string | string[];
  }>;
};

function readPage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function DataPage({ searchParams }: Props) {
  const rows = await getDocs();
  const params = await searchParams;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(readPage(params?.page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <PageHeader eyebrow="DATA / MSDS (GHS)" title="자료실" />
      <div className="shell py-16">
        <div className="overflow-x-auto rounded-[14px] border border-[#eaeef3]">
          <div className="min-w-[680px]">
            <div className={`grid ${cols} bg-[#0a1b33] text-[14px] font-bold text-white`}>
              <div className="px-5 py-[18px]">번호</div>
              <div className="px-3 py-[18px]">자료명</div>
              <div className="px-3 py-[18px]">분류</div>
              <div className="px-3 py-[18px]">등록일</div>
              <div className="px-3 py-[18px] text-center">다운로드</div>
            </div>
            {visibleRows.map((r, i) => (
              <div
                key={r.slug}
                className={`grid ${cols} items-center text-[15px]`}
                style={{
                  background: i % 2 === 1 ? "#fbfcfe" : "#fff",
                  borderBottom: i < visibleRows.length - 1 ? "1px solid #eef1f5" : "none",
                }}
              >
                <div className="p-5 font-mono text-[#8a96ab]">
                  {r.notice ? (
                    <span className="rounded-md bg-[#eef2fc] px-2 py-1 text-[12px] font-bold text-[#22409b]">공지</span>
                  ) : (
                    String(rows.length - startIndex - i).padStart(2, "0")
                  )}
                </div>
                <div className="px-3 py-5">
                  <Link
                    href={`/data/${r.slug}`}
                    className="font-semibold text-[#0a1b33] transition-colors hover:text-[#22409b]"
                  >
                    {r.name}
                  </Link>
                </div>
                <div className="px-3 py-5 text-[#5a6680]">{r.category}</div>
                <div className="px-3 py-5 font-mono text-[13px] text-[#8a96ab]">{r.date}</div>
                <div className="px-3 py-5 text-center">
                  {r.attachments.length > 0 ? (
                    <Link
                      href={`/data/${r.slug}`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#eef2fc] px-2.5 py-1.5 text-[13px] font-bold text-[#22409b]"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      {r.attachments.length > 1 ? `${r.attachments.length}개` : "PDF"}
                    </Link>
                  ) : (
                    <Link href={`/data/${r.slug}`} className="text-[13px] font-bold text-[#8a96ab]">
                      안내
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
              const active = page === currentPage;
              return (
                <Link
                  key={page}
                  href={page === 1 ? "/data" : `/data?page=${page}`}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-lg text-[14px] font-semibold"
                  style={
                    active
                      ? { background: "#0a1b33", color: "#fff", fontWeight: 700 }
                      : { border: "1px solid #e2e6ed", color: "#5a6680" }
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {page}
                </Link>
              );
            })}
          </div>
        )}
        <p className="m-0 mt-5 text-[14px] text-[#8a96ab]">
          ※ 일부 PDF는 열람 비밀번호가 설정되어 있을 수 있습니다. 필요한 경우 대표번호로 문의해 주세요.
        </p>
      </div>
    </>
  );
}
