import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "사업분야" };

const cards = [
  {
    no: "01",
    title: "이형제 제조",
    desc: "수성·유성 다이캐스팅 이형제를 자체 기술로 개발·생산합니다. 합금과 공정 조건에 맞춘 맞춤 조성 설계가 가능합니다.",
  },
  {
    no: "02",
    title: "오일류 생산·공급",
    desc: "프란자오일, 유압 작동유, 습동면유 등 다이캐스팅 설비 운전에 필요한 오일류를 안정적으로 공급합니다.",
  },
  {
    no: "03",
    title: "소모성 부자재 유통",
    desc: "필터, 노즐, 도포 설비 부속 등 현장 운영에 필요한 소모성 부자재를 함께 공급합니다.",
  },
  {
    no: "04",
    title: "기술 지원·컨설팅",
    desc: "도포 조건 최적화, 불량 개선, MSDS 등 자료 제공까지 현장 엔지니어가 밀착 지원합니다.",
  },
];

export default function BusinessPage() {
  return (
    <>
      <PageHeader eyebrow="BUSINESS" title="사업분야" breadcrumb="홈 / 사업분야" />
      <div className="px-5 py-16 lg:px-[60px] lg:py-[84px]">
        <div className="mb-14 max-w-[760px]">
          <h2 className="m-0 mb-[18px] text-[26px] font-extrabold leading-[1.35] tracking-[-0.8px] text-[#0a1b33] lg:text-[32px]">
            다이캐스팅 공정을 위한
            <br />
            토탈 솔루션
          </h2>
          <p className="m-0 text-[16px] leading-[1.8] text-[#5a6680] lg:text-[17px]">
            석연MRO는 이형제 제조를 중심으로, 다이캐스팅 현장에 필요한 윤활·작동 오일과 소모성 부자재까지 한 번에 공급합니다. 제품 공급에 그치지 않고 도포 조건 컨설팅과 기술 지원까지 함께 제공합니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((c) => (
            <div key={c.no} className="overflow-hidden rounded-[18px] border border-[#eaeef3]">
              <div className="relative flex h-[180px] items-center justify-center bg-[linear-gradient(135deg,#13294a,#0a1b33)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(15,176,200,0.25),transparent_60%)]" />
                <span className="relative font-mono text-[12px] text-[#7b8aa3]">이미지 영역</span>
              </div>
              <div className="p-[30px]">
                <div className="mb-2.5 font-mono text-[13px] text-[#0fb0c8]">{c.no}</div>
                <h3 className="m-0 mb-2.5 text-[22px] font-bold text-[#0a1b33]">{c.title}</h3>
                <p className="m-0 text-[15px] leading-[1.7] text-[#5a6680]">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
