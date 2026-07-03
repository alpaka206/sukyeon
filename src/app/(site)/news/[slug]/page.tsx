import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getNews, getNewsBySlug } from "@/lib/content";

type Props = {
  readonly params: Promise<{
    readonly slug: string;
  }>;
};

export async function generateStaticParams() {
  const items = await getNews();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  return { title: item?.title ?? "공지사항" };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  const paragraphs = item.body.length > 0 ? item.body : [item.summary];

  return (
    <>
      <PageHeader eyebrow="NEWS" title="공지사항" />
      <main className="shell py-16 pb-20">
        <article className="mx-auto max-w-230 border-t-2 border-navy pt-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-brand-soft px-2.5 py-1.25 text-[12px] font-bold text-[#22409b]">
              {item.category}
            </span>
            <span className="font-mono text-[13px] text-[#8a96ab]">{item.date}</span>
          </div>
          <h2 className="m-0 mb-5 text-[30px] font-extrabold leading-[1.35] tracking-[-0.6px] text-navy sm:text-[36px]">
            {item.title}
          </h2>
          <p className="m-0 mb-10 text-[17px] leading-[1.8] text-[#42526b]">{item.summary}</p>
          <div className="space-y-5 border-y border-[#eaeef3] py-10">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="m-0 text-[16px] leading-[1.9] text-[#42526b]">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <Link
              href="/news"
              className="rounded-[10px] border border-[#d4dae4] px-5 py-3 text-[15px] font-bold text-navy transition-colors hover:border-[#22409b] hover:text-[#22409b]"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
