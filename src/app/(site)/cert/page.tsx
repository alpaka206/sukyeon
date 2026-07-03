import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getCerts, type CertItem } from "@/lib/content";

export const metadata: Metadata = { title: "인증·특허" };

function CertCard({ cert }: { cert: CertItem }) {
  const images = [
    { src: cert.imageKo, label: "국문" },
    { src: cert.imageEn, label: "영문" },
  ].filter((img) => img.src);

  const rows = [
    { k: "인증기관", v: cert.issuer },
    { k: "인증번호", v: cert.number },
    { k: "인증범위", v: cert.scope },
    { k: "유효기간", v: cert.validity },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#eaeef3] bg-white">
      <div className="grid grid-cols-1 gap-2 bg-[#f6f9fb] p-4 sm:grid-cols-2 sm:gap-3 sm:p-5">
        {images.map((img) => (
          <a
            key={img.src}
            href={img.src}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link group relative block overflow-hidden rounded-xl border border-[#eaeef3] bg-white"
          >
            <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-navy/85 px-2 py-1 text-[11px] font-bold tracking-[1px] text-white">
              {img.label}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={`${cert.title} ${cert.standard} ${img.label} 인증서`}
              loading="lazy"
              className="block h-85 w-full object-contain p-3 sm:h-75"
            />
          </a>
        ))}
      </div>

      <div className="p-5.5 sm:p-7">
        <div className="mb-2.5 text-[12px] font-bold tracking-[2px] text-[#22409b]">
          {cert.eyebrow}
        </div>
        <h2 className="m-0 mb-1.5 text-[22px] font-extrabold tracking-[-0.5px] text-navy">
          {cert.title}
        </h2>
        <div className="mb-4 text-[14px] font-bold text-[#22409b]">{cert.standard}</div>
        <p className="m-0 mb-6 text-[15px] leading-[1.7] text-[#5a6680]">{cert.desc}</p>

        <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-[#eef1f5] pt-5 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.k} className="flex flex-col gap-1">
              <dt className="text-[12px] font-bold tracking-[0.5px] text-[#8a96ab]">{r.k}</dt>
              <dd className="m-0 text-[15px] font-semibold text-navy">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default async function CertPage() {
  const certs = await getCerts();
  return (
    <>
      <PageHeader eyebrow="CERTIFICATION" title="인증·특허" />
      <div className="shell py-16 lg:py-18">
        <p className="m-0 mb-9 max-w-190 text-[16px] leading-[1.7] text-[#5a6680]">
          석연MRO는 국제 표준 품질·환경 경영시스템 인증과 자체 기술 특허를 바탕으로 신뢰할 수 있는
          제품을 공급합니다.
        </p>

        <div className="grid grid-cols-1 gap-6.5 lg:grid-cols-2">
          {certs.map((c) => (
            <CertCard key={c.title} cert={c} />
          ))}
        </div>

        <p className="m-0 mt-8 text-[14px] leading-[1.7] text-[#8a96ab]">
          ※ 특허증·시험성적서 등 추가 인증 자료는 순차적으로 게재될 예정입니다. 자세한 자료는{" "}
          <span className="font-semibold text-[#5a6680]">자료실(MSDS·시험성적서)</span>에서 확인하실 수
          있습니다.
        </p>
      </div>
    </>
  );
}
