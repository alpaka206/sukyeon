import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getNews } from "@/lib/content";

export const metadata: Metadata = { title: "공지사항" };

const pageSize = 5;

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

export default async function NewsPage({ searchParams }: Props) {
  const items = await getNews();
  const params = await searchParams;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(readPage(params?.page), totalPages);
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <PageHeader eyebrow="NEWS" title="공지사항" />
      <div className="shell py-16 pb-20">
        <div className="border-t-2 border-[#0a1b33]">
          {visibleItems.map((n) => (
            <Link
              key={n.slug}
              href={`/news/${n.slug}`}
              className="row-link grid cursor-pointer grid-cols-1 gap-3 border-b border-[#eaeef3] px-2 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4"
            >
              <span
                className="w-fit shrink-0 rounded-md px-2.5 py-[5px] text-[12px] font-bold"
                style={{
                  color: n.accent ? "#22409b" : "#5a6680",
                  background: n.accent ? "#eef2fc" : "#f1f5f9",
                }}
              >
                {n.category}
              </span>
              <span className="min-w-0">
                <span className="block text-[16px] font-semibold text-[#0a1b33] sm:text-[17px]">{n.title}</span>
                <span className="mt-1 block text-[14px] leading-[1.6] text-[#5a6680]">{n.summary}</span>
              </span>
              <span className="shrink-0 font-mono text-[13px] text-[#8a96ab]">{n.date}</span>
            </Link>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
              const active = page === currentPage;
              return (
                <Link
                  key={page}
                  href={page === 1 ? "/news" : `/news?page=${page}`}
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
      </div>
    </>
  );
}
