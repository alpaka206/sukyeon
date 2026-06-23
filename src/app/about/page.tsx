import type { Metadata } from "next";
import Image from "next/image";
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
      <PageHeader eyebrow="COMPANY" title="회사소개" wide />
      <SectionLayout eyebrow="COMPANY" title="회사소개" items={navItems} wide>
        {/* 인사말 */}
        <section id="sec-greeting" className="spy-section border-b border-[#eef1f5] wide-shell py-16 lg:py-[74px]">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">GREETING · 인사말</div>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-[52px]">
            <div>
              <h2 className="m-0 mb-[26px] fs-4 font-extrabold leading-[1.32] tracking-[-0.7px] text-[#0a1b33]">
                현장의 신뢰에
                <br />
                품질로 답하겠습니다
              </h2>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.9] text-[#5a6680]">
                석연MRO를 믿고 함께해주신 고객 여러분께 감사드립니다. 1996년 석연상사로 시작한 이후 저희는 다이캐스팅 현장에서 필요한 이형제, 프란자오일, 오일류와 부자재를 가까이에서 공급해 왔습니다.
              </p>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.9] text-[#5a6680]">
                제품 하나가 공정의 안정성과 생산성에 영향을 준다는 마음으로 원료, 배합, 납품, 사후 대응까지 기본을 지켜 왔습니다. 현장의 목소리를 듣고 개선하는 태도가 석연MRO의 가장 중요한 기준입니다.
              </p>
              <p className="m-0 text-[16px] leading-[1.9] text-[#5a6680]">
                앞으로도 초심을 잃지 않고 안정적인 품질과 책임 있는 대응으로 고객사의 공정에 실질적인 도움이 되는 파트너가 되겠습니다.
              </p>
              <div className="mt-[30px] border-t border-[#eaeef3] pt-6 text-[16px] text-[#5a6680]">
                석연MRO 임직원 일동 · 대표{" "}
                <strong className="ml-1.5 text-[21px] text-[#0a1b33]">정원재</strong>
              </div>
            </div>
            <div>
              <div className="relative mb-4 min-h-[300px] overflow-hidden rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb]">
                <Image
                  src="/assets/company/factory-exterior.jpg"
                  alt="석연MRO 공장 외관"
                  fill
                  loading="eager"
                  sizes="(max-width: 1024px) calc(100vw - 40px), 430px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 회사소개 */}
        <section id="sec-info" className="spy-section border-b border-[#eef1f5] bg-[#fbfcfe] wide-shell py-16 lg:py-[74px]">
          <div className="mb-4 font-mono text-[13px] tracking-[2px] text-[#22409b]">INFORMATION · 소개</div>
          <div className="mb-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-[52px]">
            <div>
              <h2 className="m-0 mb-6 fs-4 font-extrabold leading-[1.32] tracking-[-0.7px] text-[#0a1b33]">
                제조 설비와 기술로
                <br />
                품질을 안정화합니다
              </h2>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.85] text-[#5a6680]">
                석연MRO는 2006년 제조설비 확충 이후 국산 다이캐스팅 이형제와 프란자오일 생산 체계를 구축했습니다. 유화 반응기, 교반기, 고온 반응기 등 설비를 기반으로 제품 특성에 맞는 배합과 생산을 운영합니다.
              </p>
              <p className="m-0 mb-[18px] text-[16px] leading-[1.85] text-[#5a6680]">
                현재는 이형제, 프란자오일, 작동유, 습동면유, 소모성 부자재까지 현장 운영에 필요한 품목을 함께 공급하며 로트별 품질 관리와 납기 대응을 강화하고 있습니다.
              </p>
              <p className="m-0 text-[16px] leading-[1.85] text-[#5a6680]">
                축적된 공정 경험을 바탕으로 도포 조건, 설비 운전 환경, 불량 개선 과제를 함께 검토하고 고객사의 생산 조건에 맞는 제품을 제안합니다.
              </p>
            </div>
            <div className="relative h-[260px] overflow-hidden rounded-[18px] border border-[#eaeef3] bg-[#f6f9fb] lg:h-[340px]">
              <Image
                src="/assets/company/production-equipment.jpg"
                alt="석연MRO 생산 설비와 반응기"
                fill
                sizes="(max-width: 1024px) calc(100vw - 40px), 430px"
                className="object-cover"
              />
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
        <section id="sec-history" className="spy-section wide-shell py-16 lg:py-[74px]">
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
        <section id="sec-location" className="spy-section border-t border-[#eef1f5] wide-shell py-16 lg:py-[74px]">
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
