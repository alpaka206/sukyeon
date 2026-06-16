import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "인증·특허" };

const certs = [
  { title: "ISO 9001", desc: "품질경영시스템 인증" },
  { title: "특허증", desc: "이형제 조성 관련 특허" },
  { title: "시험성적서", desc: "공인기관 성능 시험" },
  { title: "기업 인증", desc: "중소기업·직접생산 확인 등" },
];

export default function CertPage() {
  return (
    <>
      <PageHeader eyebrow="CERTIFICATION" title="인증·특허" breadcrumb="홈 / 인증·특허" />
      <div className="px-5 py-16 lg:px-[60px] lg:py-[72px]">
        <p className="m-0 mb-9 max-w-[760px] text-[16px] leading-[1.7] text-[#5a6680]">
          석연MRO는 품질경영시스템 인증과 자체 기술 특허를 바탕으로 신뢰할 수 있는 제품을 공급합니다.
        </p>
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {certs.map((c) => (
            <div key={c.title} className="overflow-hidden rounded-2xl border border-[#eaeef3]">
              <div className="flex h-[230px] items-center justify-center border-b border-[#eaeef3] bg-[#f6f9fb]">
                <span className="font-mono text-[12px] text-[#aab4c5]">인증서 이미지</span>
              </div>
              <div className="p-[22px]">
                <h3 className="m-0 mb-1.5 text-[17px] font-bold text-[#0a1b33]">{c.title}</h3>
                <p className="m-0 text-[14px] text-[#5a6680]">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="m-0 mt-6 text-[14px] text-[#8a96ab]">
          ※ 인증서·특허증 이미지와 번호는 보유 자료로 교체 예정입니다.
        </p>
      </div>
    </>
  );
}
