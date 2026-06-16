import Link from "next/link";
import { company, footerColumns } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-[#0a1b33] px-5 pb-10 pt-[60px] text-[#8ea1bd] lg:px-[60px]">
      <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <div className="mb-4 text-[22px] font-extrabold text-white">
            석연<span className="text-[#0fb0c8]">MRO</span>
          </div>
          <p className="m-0 mb-4 text-[14px] leading-[1.8]">
            알루미늄 다이캐스팅 이형제·프란자오일·작동유·습동면유·소모성 부자재 전문 제조
            <br />
            {company.address}
            <br />
            대표 {company.ceo} · 사업자등록번호 {company.bizNo}
          </p>
          <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-[14px]">
            <span>TEL {company.tel}</span>
            <span>FAX {company.fax}</span>
            <span>{company.email}</span>
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-[15px] font-bold text-white">{col.title}</div>
            <div className="flex flex-col gap-y-[9px] text-[14px]">
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="w-fit transition-colors hover:text-[#0fb0c8]">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-6 font-mono text-[13px] text-[#5d6f88]">
        © 2026 SUKYEON MRO. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
