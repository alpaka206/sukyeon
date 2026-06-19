import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "제조과정" };

type Step = { no: string; title: string; icon: React.ReactNode; last?: boolean };

const steps: Step[] = [
  { no: "01", title: "1차원료 투입", icon: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>) },
  { no: "02", title: "반응", icon: (<><path d="M9 3h6" /><path d="M10 3v6.5L5.2 18.2A1.5 1.5 0 0 0 6.5 20.5h11a1.5 1.5 0 0 0 1.3-2.3L14 9.5V3" /></>) },
  { no: "03", title: "2차원료 생산", icon: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.2A1.6 1.6 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 14H4.5a2 2 0 0 1 0-4h.2A1.6 1.6 0 0 0 6 7.3L5.9 7a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H11a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.1a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z" /></>) },
  { no: "04", title: "2차원료 투입", icon: (<path d="M12 2.5S5 9 5 14a7 7 0 0 0 14 0c0-5-7-11.5-7-11.5z" />) },
  { no: "05", title: "교반", icon: (<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>) },
  { no: "06", title: "검사", icon: (<><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></>) },
  { no: "07", title: "완제품 생산", icon: (<><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.3 7L12 12l8.7-5M12 22V12" /></>) },
  { no: "08", title: "제품 출하", last: true, icon: (<><path d="M5 17h-2v-6l2-5h9l4 5h2a1 1 0 0 1 1 1v5h-2" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>) },
];

const equipment = [
  { no: "1호기", name: "유화 반응기 (초고속)", cap: "1 ton" },
  { no: "2호기", name: "유화 반응기 (초고속)", cap: "1 ton" },
  { no: "3호기", name: "교반기", cap: "3 ton" },
  { no: "4호기", name: "고온 반응기", cap: "2 ton" },
  { no: "5호기", name: "프란자오일 교반기", cap: "12 ton" },
];

function Arrow() {
  return (
    <div className="hidden w-[34px] shrink-0 items-center justify-center text-[#c4cedb] lg:flex">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </div>
  );
}

function StepCard({ s }: { s: Step }) {
  return (
    <div
      className="flex-1 basis-[45%] rounded-2xl border p-[18px] py-[30px] text-center lg:basis-0"
      style={{
        background: s.last ? "#0a1b33" : "#fff",
        borderColor: s.last ? "#0a1b33" : "#e8edf3",
      }}
    >
      <div
        className="mx-auto mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-[15px]"
        style={{ background: s.last ? "rgba(79,116,230,0.18)" : "#eef2fc" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={s.last ? "#4f74e6" : "#22409b"} strokeWidth="1.8">
          {s.icon}
        </svg>
      </div>
      <div
        className="mb-[7px] font-mono text-[12px] font-semibold"
        style={{ color: s.last ? "#4f74e6" : "#22409b" }}
      >
        STEP {s.no}
      </div>
      <div className="text-[17px] font-bold" style={{ color: s.last ? "#fff" : "#0a1b33" }}>
        {s.title}
      </div>
    </div>
  );
}

function StepRow({ rowSteps }: { rowSteps: Step[] }) {
  return (
    <div className="flex flex-wrap items-stretch gap-y-3 lg:flex-nowrap">
      {rowSteps.map((s, i) => (
        <Fragmentish key={s.no} arrow={i > 0}>
          <StepCard s={s} />
        </Fragmentish>
      ))}
    </div>
  );
}

function Fragmentish({ arrow, children }: { arrow: boolean; children: React.ReactNode }) {
  return (
    <>
      {arrow && <Arrow />}
      {children}
    </>
  );
}

export default function ProcessPage() {
  return (
    <>
      <PageHeader eyebrow="PROCESS" title="제조과정" breadcrumb="홈 / 사업분야 / 제조과정" />

      <div className="shell py-16 lg:py-20">
        <div className="mb-3.5 font-mono text-[13px] tracking-[2px] text-[#22409b]">MANUFACTURING FLOW</div>
        <h2 className="m-0 mb-3 fs-3 font-extrabold tracking-[-0.8px] text-[#0a1b33]">제조 공정</h2>
        <p className="m-0 mb-12 max-w-[680px] text-[16px] leading-[1.7] text-[#5a6680]">
          원료 투입부터 제품 출하까지, 석연MRO의 표준 제조 공정입니다. 전 공정에서 품질을 관리하여 균일한 성능의 제품을 생산합니다.
        </p>

        <div className="mb-[18px]">
          <StepRow rowSteps={steps.slice(0, 4)} />
        </div>
        <StepRow rowSteps={steps.slice(4, 8)} />
      </div>

      {/* equipment */}
      <div className="bg-[#f6f9fb] shell py-16 lg:py-20">
        <div className="mb-3.5 font-mono text-[13px] tracking-[2px] text-[#22409b]">EQUIPMENT</div>
        <h2 className="m-0 mb-9 fs-3 font-extrabold tracking-[-0.8px] text-[#0a1b33]">설비현황</h2>
        <div className="overflow-x-auto rounded-2xl border border-[#eaeef3] bg-white">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[180px_1fr_180px] bg-[#0a1b33] text-center text-[15px] font-bold text-white">
              <div className="p-[18px]">구분</div>
              <div className="p-[18px]">설비명</div>
              <div className="p-[18px]">설비용량</div>
            </div>
            {equipment.map((e, i) => (
              <div
                key={e.no}
                className="grid grid-cols-[180px_1fr_180px] items-center text-center"
                style={{
                  background: i % 2 === 1 ? "#fbfcfe" : "#fff",
                  borderBottom: i < equipment.length - 1 ? "1px solid #eef1f5" : "none",
                }}
              >
                <div className="p-5 font-bold text-[#0a1b33]">{e.no}</div>
                <div className="p-5 text-[15px] text-[#42526b]">{e.name}</div>
                <div className="p-5 font-mono font-bold text-[#22409b]">{e.cap}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
