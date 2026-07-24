import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import { ProductGallery, type GalleryItem } from "@/components/ProductGallery";
import SectionLayout from "@/components/SectionLayout";
import {
  getProductGalleries,
  getProductLineups,
  type ProductGallery as GalleryData,
  type ProductLineup,
} from "@/lib/content";

export const metadata: Metadata = { title: "제품소개" };

const h2Cls = "m-0 mb-4 fs-3 font-extrabold tracking-[-0.8px] text-navy";
const pCls = "m-0 mb-6 break-keep text-pretty text-[16px] leading-[1.8] text-[#5a6680]";

function keepTogether(text: string): string {
  return ["우수한 이형성과", "고온 안정성", "작업 환경", "피막 형성"].reduce(
    (result, phrase) => result.replaceAll(phrase, phrase.replaceAll(" ", "\u00a0")),
    text,
  );
}

function MsdsLink() {
  return (
    <Link href="/data" className="link-teal inline-flex items-center gap-2 text-[15px] font-bold text-[#22409b]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5M12 15V3" />
      </svg>
      MSDS · 시험성적서 다운로드
    </Link>
  );
}

// ‘ — ’ 앞부분을 굵게
function Bullet({ text }: { readonly text: string }) {
  const wrappedText = keepTogether(text);
  const i = wrappedText.indexOf(" — ");
  const body: ReactNode =
    i === -1 ? wrappedText : (
      <>
        <strong className="text-navy">{wrappedText.slice(0, i)}</strong>
        {wrappedText.slice(i)}
      </>
    );
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 font-extrabold text-[#22409b]">·</span>
      <span className="break-keep text-pretty text-[15px] text-[#42526b]">{body}</span>
    </div>
  );
}

// 줄바꿈(\n)을 <br/>로
function MultiLine({ text }: { readonly text: string }) {
  return (
    <>
      {text.split("\n").map((line, idx) => (
        <span key={`${line}-${idx}`}>
          {idx > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

function lineupItems(lineup: ProductLineup): GalleryItem[] {
  return lineup.items.map((it) => ({
    image: it.image,
    title: it.code,
    summary: it.summary,
    points: it.points,
    documents: it.documents,
  }));
}

function LineupSection({ lineup, id, gray }: { readonly lineup: ProductLineup; readonly id: string; readonly gray?: boolean }) {
  return (
    <section
      id={id}
      className={`spy-section grid grid-cols-1 items-start gap-10 wide-shell py-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14 lg:py-20 ${gray ? "bg-[#f6f9fb]" : ""}`}
    >
      <div>
        <h2 className={h2Cls}>
          {lineup.title} {lineup.brand ? <span className="text-[18px] font-bold text-[#22409b]">{lineup.brand}</span> : null}
        </h2>
        <p className={pCls}>{keepTogether(lineup.intro)}</p>
        {lineup.bullets.length > 0 && (
          <div className="mb-7 flex flex-col gap-3">
            {lineup.bullets.map((b) => (
              <Bullet key={b} text={b} />
            ))}
          </div>
        )}
        <MsdsLink />
      </div>
      <ProductGallery groupLabel={`${lineup.title} ${lineup.brand}`.trim()} variant="panel" items={lineupItems(lineup)} />
    </section>
  );
}

function GallerySection({ gallery, id, gray }: { readonly gallery: GalleryData; readonly id: string; readonly gray?: boolean }) {
  return (
    <section id={id} className={`spy-section wide-shell py-16 lg:py-20 ${gray ? "bg-[#f6f9fb]" : ""}`}>
      <div className="mb-9 max-w-220">
        <h2 className={h2Cls}>{gallery.title}</h2>
        <p className={pCls}>
          <MultiLine text={gallery.intro} />
        </p>
      </div>
      <ProductGallery groupLabel={gallery.title} items={gallery.items as GalleryItem[]} />
    </section>
  );
}

export default async function ProductsPage() {
  const [lineups, galleries] = await Promise.all([getProductLineups(), getProductGalleries()]);
  const lineup = (key: string) => lineups.find((l) => l.key === key);
  const gallery = (key: string) => galleries.find((g) => g.key === key);

  const release = lineup("release");
  const pranza = lineup("pranza");
  const machineParts = gallery("machine-parts");
  const spray = gallery("spray");
  const crucible = gallery("crucible");

  const navItems = [
    release && { id: "p-release", label: release.title },
    pranza && { id: "p-pranza", label: pranza.title },
    machineParts && { id: "p-machine-parts", label: machineParts.title },
    spray && { id: "p-spray", label: spray.title },
    crucible && { id: "p-crucible", label: crucible.title },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <>
      <PageHeader title="제품소개" wide />
      <SectionLayout title="제품소개" items={navItems} wide>
        {release && <LineupSection lineup={release} id="p-release" />}
        {pranza && <LineupSection lineup={pranza} id="p-pranza" gray />}
        {machineParts && <GallerySection gallery={machineParts} id="p-machine-parts" />}
        {spray && <GallerySection gallery={spray} id="p-spray" gray />}
        {crucible && <GallerySection gallery={crucible} id="p-crucible" />}

        <div className="wide-shell pb-20">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[18px] bg-navy p-8 text-white sm:flex-row sm:items-center lg:p-12.5">
            <div>
              <h3 className="m-0 mb-2 text-[22px] font-extrabold lg:text-[26px]">어떤 제품이 맞을지 고민되시나요?</h3>
              <p className="m-0 text-[15px] text-[#b6c3d6]">공정 조건을 알려주시면 최적의 제품을 추천해 드립니다.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 cursor-pointer rounded-[10px] bg-brand px-7.5 py-3.75 text-[16px] font-bold text-white transition-opacity hover:opacity-90"
            >
              맞춤 견적 받기
            </Link>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}
