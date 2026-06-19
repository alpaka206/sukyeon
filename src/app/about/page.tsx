import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionLayout from "@/components/SectionLayout";

export const metadata: Metadata = { title: "회사소개" };

const navItems = [
  { id: "sec-greeting", label: "인사말" },
  { id: "sec-info", label: "회사소개" },
  { id: "sec-history", label: "연혁" },
  { id: "sec-location", label: "오시는 길" },
];

const history = [
  { year: "1996", lines: ["석연상사 회사 설립", "니카코리아(주) 중부 총판 대리점"], last: false },
  {
    year: "2006",
    lines: [
      "석연MRO로 회사명 변경 및 공장 이전",
      "유화 반응기(초고속) 도입",
      "캐스트원(CAST ONE) 생산 개시",
      "루브원(LUBE ONE) 생산 개시",
      "대구대리점 개설 (명진상사)",
    ],
    last: false,
  },
  { year: "2010", lines: ["경인대리점 개설 (삼육)", "수용성 프란자오일, 마그네슘 이형제 개발·생산"], last: false },
  { year: "2015", lines: ["베트남 하노이 대리점 개설 (PNA VINA)"], last: false },
  { year: "2017", lines: ["유화 반응기(초고속) 추가 도입"], last: true },
];

const values = [
  { no: "01", title: "품질 우선", desc: "원료 입고부터 출하까지 전 공정을 관리해 균일한 성능을 보장합니다." },
  { no: "02", title: "현장 중심", desc: "실제 라인 조건에서 검증하고, 공정에 맞춘 솔루션을 제안합니다." },
  { no: "03", title: "신뢰 동행", desc: "신속 납품과 지속적인 사후 지원으로 장기적 파트너십을 만듭니다." },
];

const infoRows = [
  { k: "주소", v: "인천광역시 서구 염곡로 15번길 16" },
  { k: "전화", v: "032-575-2492" },
  { k: "팩스", v: "032-575-2493" },
  { k: "이메일", v: "sukyeonmro@naver.com" },
  { k: "상호", v: "석연MRO · 대표 정원재" },
  { k: "영업시간", v: "평일 09:00 – 18:00 (점심 12:00 – 13:00)" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="COMPANY" title="회사소개" breadcrumb="홈 / 회사소개" />
      <SectionLayout eyebrow="COMPANY" title="회사소개" items={navItems}>
        {/* 인사말 */}
        <section id="sec-greeting" className="spy-section border-b border-[#eef1f5] shell py-16 lg:py-[74px]">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">GREETING · 인사말</div>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-[52px]">
            <div>
              <h2 className="m-0 mb-[26px] fs-4 font-extrabold leading-[1.32] tracking-[-0.7px] text-[#0a1b33]">
                고객 여러분께
                <br />
                깊은 감사를 드립니다
              </h2>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.9] text-[#5a6680]">
                항상 저희 석연MRO를 성원해주시고 끊임없이 격려해주신 고객 여러분께 깊은 감사를 드립니다. 석연MRO는 1996년 개업 후 다이캐스팅 이형제 및 프란자오일과 각종 다이캐스팅 부자재를 취급·판매해 왔습니다.
              </p>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.9] text-[#5a6680]">
                그동안의 성원에 힘입어 2006년 제조설비 확충과 꾸준한 연구 개발을 통해 국산 다이캐스팅 이형제·프란자오일을 생산·판매하며, 다이캐스팅 제품의 생산성 증대와 운용비용 절감, 주조환경 개선에 도움을 드리고 있으며 그 우수성을 인정받고 있습니다.
              </p>
              <p className="m-0 text-[16px] leading-[1.9] text-[#5a6680]">
                당사는 기술개발을 통한 제품의 품질 향상과 안정적인 공급을 목표로 하고 있으며, 초심을 잃지 않고 다이캐스팅 소모성 자재 제작 공급업체로서 최고 품질을 유지할 것이며, 꾸준한 고객사와의 커뮤니케이션을 통해 고객사의 니즈를 파악하여 고객사의 공정에 도움을 드릴 것을 약속드립니다.
              </p>
              <div className="mt-[30px] border-t border-[#eaeef3] pt-6 text-[16px] text-[#5a6680]">
                석연MRO 임직원 일동 · 대표{" "}
                <strong className="ml-1.5 text-[21px] text-[#0a1b33]">정원재</strong>
              </div>
            </div>
            <div>
              <div className="relative mb-4 flex min-h-[300px] items-center justify-center overflow-hidden rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb]">
                <span className="relative font-mono text-[12px] text-[#8a96ab]">대표 / 회사 이미지</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[14px] border border-[#eaeef3] bg-[#f6f9fb] p-5">
                  <div className="mb-1.5 font-mono text-[12px] text-[#22409b]">SINCE</div>
                  <div className="text-[23px] font-extrabold text-[#0a1b33]">1996</div>
                </div>
                <div className="rounded-[14px] border border-[#eaeef3] bg-[#f6f9fb] p-5">
                  <div className="mb-1.5 font-mono text-[12px] text-[#22409b]">CEO</div>
                  <div className="text-[23px] font-extrabold text-[#0a1b33]">정원재</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 회사소개 */}
        <section id="sec-info" className="spy-section border-b border-[#eef1f5] bg-[#fbfcfe] shell py-16 lg:py-[74px]">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">INFORMATION · 소개</div>
          <div className="mb-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-[52px]">
            <div>
              <h2 className="m-0 mb-6 fs-4 font-extrabold leading-[1.32] tracking-[-0.7px] text-[#0a1b33]">
                1996년부터, 다이캐스팅
                <br />
                국산화의 길을 걸어왔습니다
              </h2>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.85] text-[#5a6680]">
                저희 석연MRO는 1996년 개업 이후 다이캐스팅 이형제 및 프란자오일과 각종 다이캐스팅 부자재의 국산화를 위해 노력해 왔습니다.
              </p>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.85] text-[#5a6680]">
                고객 여러분의 성원과 끊임없는 격려로 2006년도에는 다이캐스팅 이형제와 프란자오일 제조설비 확충으로 국산 다이캐스팅 이형제·프란자오일을 생산·판매하게 되었으며, 꾸준한 연구개발을 통해 다이캐스팅 완제품의 생산성 증대와 운용비용 절감을 위해 노력해 왔습니다.
              </p>
              <p className="m-0 text-[16px] leading-[1.85] text-[#5a6680]">
                또한 주조환경 개선에 도움이 되는 제품 생산으로 그 우수성도 인정받고 있습니다. 앞으로도 당사는 꾸준한 기술개발을 통해 제품의 품질 향상과 안정적인 공급을 목표로, 초심을 잃지 않는 다이캐스팅 소모성 부자재 전문 생산업체로서 최고 품질과 고객사와의 소통을 통해 고객사의 니즈를 파악하여 고객사의 공정에 도움을 드릴 것을 약속드립니다.
              </p>
            </div>
            <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb] lg:h-[340px]">
              <span className="relative font-mono text-[12px] text-[#8a96ab]">공장 전경 / 생산 설비 이미지</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.no} className="rounded-2xl border border-[#eaeef3] bg-white px-7 py-[30px]">
                <div className="mb-3 font-mono text-[34px] font-extrabold text-[#22409b]">{v.no}</div>
                <h3 className="m-0 mb-2 text-[19px] font-bold">{v.title}</h3>
                <p className="m-0 text-[14.5px] leading-[1.65] text-[#5a6680]">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 연혁 */}
        <section id="sec-history" className="spy-section shell py-16 lg:py-[74px]">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">HISTORY · 연혁</div>
          <h2 className="m-0 mb-2 fs-4 font-extrabold leading-[1.3] tracking-[-0.7px] text-[#0a1b33]">
            걸어온 길
          </h2>
          <p className="m-0 mb-11 text-[15px] leading-[1.7] text-[#8a96ab]">
            1996년 석연상사 설립 이후, 다이캐스팅 이형제·프란자오일 국산화를 이끌어 온 발자취입니다.
          </p>
          <div className="max-w-[680px] border-l-2 border-[#eaeef3] pl-9">
            {history.map((h) => (
              <div key={h.year} className={`relative ${h.last ? "" : "mb-9"}`}>
                <div
                  className="absolute -left-[44px] top-1 h-3 w-3 rounded-full"
                  style={{ background: h.last ? "#0a1b33" : "#22409b" }}
                />
                <div
                  className="mb-2.5 font-mono text-[22px] font-bold"
                  style={{ color: h.last ? "#0a1b33" : "#22409b" }}
                >
                  {h.year}
                </div>
                <div className="text-[16px] leading-[1.95] text-[#42526b]">
                  {h.lines.map((l, i) => (
                    <span key={i}>
                      – {l}
                      {i < h.lines.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 오시는 길 */}
        <section id="sec-location" className="spy-section border-t border-[#eef1f5] shell py-16 lg:py-[74px]">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">LOCATION · 오시는 길</div>
          <h2 className="m-0 mb-[30px] fs-4 font-extrabold tracking-[-0.7px] text-[#0a1b33]">
            오시는 길
          </h2>
          <div className="relative mb-6 flex h-[300px] items-center justify-center overflow-hidden rounded-[18px] border border-[#e2e6ed] bg-[#eef2f6] lg:h-[380px]">
            <div className="absolute inset-0 [background-image:linear-gradient(#dde4ec_1px,transparent_1px),linear-gradient(90deg,#dde4ec_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="relative text-center">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#22409b" strokeWidth="2" className="mx-auto mb-3">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="text-[16px] font-bold text-[#0a1b33]">인천광역시 서구 염곡로 15번길 16</div>
              <div className="mt-1.5 font-mono text-[13px] text-[#8a96ab]">지도 영역 · 카카오/네이버 지도 연동 예정</div>
            </div>
          </div>
          <div className="rounded-2xl border border-[#eaeef3] px-6 py-6 sm:px-9">
            <div className="grid grid-cols-1 gap-x-14 sm:grid-cols-2">
              {infoRows.map((r) => (
                <div key={r.k} className="flex gap-3.5 border-b border-[#f0f3f7] py-[15px] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                  <span className="w-[70px] shrink-0 text-[14px] font-bold text-[#22409b]">{r.k}</span>
                  <span className="text-[15px] leading-[1.5] text-[#42526b]">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionLayout>
    </>
  );
}
