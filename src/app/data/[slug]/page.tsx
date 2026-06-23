import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getDocBySlug, getDocs } from "@/lib/content";

type Props = {
  readonly params: Promise<{
    readonly slug: string;
  }>;
};

export async function generateStaticParams() {
  const items = await getDocs();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDocBySlug(slug);
  return { title: item?.name ?? "자료실" };
}

export default async function DataDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getDocBySlug(slug);

  if (!item) {
    notFound();
  }

  const paragraphs = item.body.length > 0 ? item.body : item.summary ? [item.summary] : [];

  return (
    <>
      <PageHeader eyebrow="DATA / MSDS (GHS)" title="자료실" />
      <main className="shell py-16 pb-20">
        <article className="mx-auto max-w-[960px] border-t-2 border-[#0a1b33] pt-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-[#eef2fc] px-2.5 py-[5px] text-[12px] font-bold text-[#22409b]">
              {item.category}
            </span>
            <span className="font-mono text-[13px] text-[#8a96ab]">{item.date}</span>
          </div>
          <h2 className="m-0 mb-5 text-[30px] font-extrabold leading-[1.35] tracking-[-0.6px] text-[#0a1b33] sm:text-[36px]">
            {item.name}
          </h2>
          {item.summary && <p className="m-0 mb-10 text-[17px] leading-[1.8] text-[#42526b]">{item.summary}</p>}

          {paragraphs.length > 0 && (
            <div className="space-y-5 border-y border-[#eaeef3] py-10">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="m-0 text-[16px] leading-[1.9] text-[#42526b]">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          <section className="mt-10 rounded-[14px] border border-[#e2e6ed] bg-[#fbfcfe] p-6 sm:p-8">
            <h3 className="m-0 mb-5 text-[20px] font-extrabold text-[#0a1b33]">첨부 PDF</h3>
            {item.attachments.length > 0 ? (
              <div className="grid gap-3">
                {item.attachments.map((attachment) => (
                  <a
                    key={attachment.file}
                    href={attachment.file}
                    target="_blank"
                    rel="noopener"
                    className="flex flex-col gap-3 rounded-[10px] border border-[#eaeef3] bg-white p-4 text-[#0a1b33] transition-colors hover:border-[#22409b] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0 text-[15px] font-semibold leading-[1.6]">{attachment.name}</span>
                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-[#eef2fc] px-3 py-2 text-[13px] font-bold text-[#22409b]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      다운로드
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[15px] leading-[1.7] text-[#5a6680]">
                이 안내 게시물에는 별도 첨부 PDF가 없습니다.
              </p>
            )}
          </section>

          <div className="mt-10 flex justify-end">
            <Link
              href="/data"
              className="rounded-[10px] border border-[#d4dae4] px-5 py-3 text-[15px] font-bold text-[#0a1b33] transition-colors hover:border-[#22409b] hover:text-[#22409b]"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
