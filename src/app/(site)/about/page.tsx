import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import SectionLayout from "@/components/SectionLayout";
import { getAboutPage, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "회사소개" };

const navItems = [
  { id: "sec-greeting", label: "인사말" },
  { id: "sec-info", label: "회사소개" },
  { id: "sec-equipment", label: "설비현황" },
  { id: "sec-history", label: "연혁" },
  { id: "sec-location", label: "오시는 길" },
];

function MultiLine({ text }: { readonly text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={line}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutPage(), getSiteSettings()]);
  if (!about) return null;
  const { greeting, info, equipment, history, location } = about;
  const c = settings?.company;
  const infoRows = [
    { k: "주소", v: c?.address ?? "" },
    { k: "전화", v: c?.tel ?? "" },
    { k: "팩스", v: c?.fax ?? "" },
    { k: "이메일", v: c?.email ?? "" },
    { k: "상호", v: c ? `${c.name} · 대표 ${c.ceo}` : "" },
    { k: "영업시간", v: c?.hours ?? "" },
  ];

  return (
    <>
      <PageHeader title="회사소개" wide />
      <SectionLayout title="회사소개" items={navItems} wide>
        {/* 인사말 */}
        <section id="sec-greeting" className="spy-section border-b border-[#eef1f5] wide-shell py-16 lg:py-18.5">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">인사말</div>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-13">
            <div>
              <h2 className="m-0 mb-6.5 fs-4 font-extrabold leading-[1.32] tracking-[-0.7px] text-navy">
                <MultiLine text={greeting.heading} />
              </h2>
              {greeting.paragraphs.map((p, i) => (
                <p key={p} className={`m-0 text-[16px] leading-[1.9] text-[#5a6680] ${i < greeting.paragraphs.length - 1 ? "mb-4.5" : ""}`}>
                  {p}
                </p>
              ))}
              <div className="mt-7.5 border-t border-[#eaeef3] pt-6 text-[16px] text-[#5a6680]">
                {greeting.signLabel}{" "}
                <strong className="ml-1.5 text-[21px] text-navy">{greeting.signName}</strong>
              </div>
            </div>
            <div>
              <div className="relative mb-4 min-h-75 overflow-hidden rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb]">
                {greeting.image && (
                  <Image src={greeting.image} alt="석연MRO 공장 외관" fill loading="eager" sizes="(max-width: 1024px) calc(100vw - 40px), 430px" className="object-cover" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 회사소개 */}
        <section id="sec-info" className="spy-section border-b border-[#eef1f5] bg-[#fbfcfe] wide-shell py-16 lg:py-18.5">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">소개</div>
          <div className="mb-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-13">
            <div>
              <h2 className="m-0 mb-6 fs-4 font-extrabold leading-[1.32] tracking-[-0.7px] text-navy">
                <MultiLine text={info.heading} />
              </h2>
              {info.paragraphs.map((p, i) => (
                <p key={p} className={`m-0 text-[16px] leading-[1.85] text-[#5a6680] ${i < info.paragraphs.length - 1 ? "mb-4.5" : ""}`}>
                  {p}
                </p>
              ))}
            </div>
            <div className="relative h-65 overflow-hidden rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb] lg:h-85">
              {info.image && (
                <Image src={info.image} alt="석연MRO 생산 설비와 반응기" fill sizes="(max-width: 1024px) calc(100vw - 40px), 430px" className="object-cover" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-3">
            {info.values.map((v) => (
              <div key={v.no} className="rounded-2xl border border-[#eaeef3] bg-white px-7 py-7.5">
                <div className="mb-3 font-mono text-[34px] font-extrabold text-[#22409b]">{v.no}</div>
                <h3 className="m-0 mb-2 text-[19px] font-bold">{v.title}</h3>
                <p className="m-0 text-[14.5px] leading-[1.65] text-[#5a6680]">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 설비현황 */}
        <section id="sec-equipment" className="spy-section border-b border-[#eef1f5] wide-shell py-16 lg:py-18.5">
          <h2 className="m-0 mb-2 fs-4 font-extrabold leading-[1.3] tracking-[-0.7px] text-navy">설비현황</h2>
          <p className="m-0 mb-11 text-[15px] leading-[1.7] text-muted">{equipment.desc}</p>
          <div className="overflow-x-auto rounded-2xl border border-[#eaeef3] bg-white">
            <div className="min-w-140">
              <div className="grid grid-cols-[180px_1fr_180px] bg-navy text-center text-[15px] font-bold text-white">
                <div className="p-4.5">구분</div>
                <div className="p-4.5">설비명</div>
                <div className="p-4.5">설비용량</div>
              </div>
              {equipment.rows.map((e, i) => (
                <div
                  key={e.no}
                  className="grid grid-cols-[180px_1fr_180px] items-center text-center"
                  style={{
                    background: i % 2 === 1 ? "#fbfcfe" : "#fff",
                    borderBottom: i < equipment.rows.length - 1 ? "1px solid #eef1f5" : "none",
                  }}
                >
                  <div className="p-5 font-bold text-navy">{e.no}</div>
                  <div className="p-5 text-[15px] text-[#42526b]">{e.name}</div>
                  <div className="p-5 font-mono font-bold text-[#22409b]">{e.cap}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 연혁 */}
        <section id="sec-history" className="spy-section wide-shell py-16 lg:py-18.5">
          <h2 className="m-0 mb-2 fs-4 font-extrabold leading-[1.3] tracking-[-0.7px] text-navy">걸어온 길</h2>
          <p className="m-0 mb-11 text-[15px] leading-[1.7] text-muted">{history.desc}</p>
          <div className="max-w-170 border-l-2 border-[#eaeef3] pl-9">
            {history.entries.map((h, idx) => {
              const last = idx === history.entries.length - 1;
              return (
                <div key={h.year} className={`relative ${last ? "" : "mb-9"}`}>
                  <div className="absolute -left-11 top-1 h-3 w-3 rounded-full" style={{ background: "#22409b" }} />
                  <div className="mb-2.5 font-mono text-[22px] font-bold" style={{ color: "#22409b" }}>
                    {h.year}
                  </div>
                  <div className="text-[16px] leading-[1.95] text-[#42526b]">
                    {h.lines.map((l, i) => (
                      <span key={l}>
                        – {l}
                        {i < h.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 오시는 길 */}
        <section id="sec-location" className="spy-section border-t border-[#eef1f5] wide-shell py-16 lg:py-18.5">
          <h2 className="m-0 mb-7.5 fs-4 font-extrabold tracking-[-0.7px] text-navy">오시는 길</h2>
          <div className="relative mb-6 flex h-75 items-center justify-center overflow-hidden rounded-[18px] border border-[#e2e6ed] bg-[#eef2f6] lg:h-95">
            <div className="absolute inset-0 bg-[linear-gradient(#dde4ec_1px,transparent_1px),linear-gradient(90deg,#dde4ec_1px,transparent_1px)] bg-size-[40px_40px]" />
            <div className="relative text-center">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#22409b" strokeWidth="2" className="mx-auto mb-3">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="text-[16px] font-bold text-navy">{c?.address}</div>
              <div className="mt-1.5 font-mono text-[13px] text-muted">{location.mapNote}</div>
            </div>
          </div>
          <div className="rounded-2xl border border-[#eaeef3] px-6 py-6 sm:px-9">
            <div className="grid grid-cols-1 gap-x-14 sm:grid-cols-2">
              {infoRows.map((r) => (
                <div key={r.k} className="flex gap-3.5 border-b border-[#f0f3f7] py-3.75 last:border-b-0 sm:nth-last-[-n+2]:border-b-0">
                  <span className="w-17.5 shrink-0 text-[14px] font-bold text-[#22409b]">{r.k}</span>
                  <span className="text-[15px] leading-normal text-[#42526b]">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionLayout>
    </>
  );
}
