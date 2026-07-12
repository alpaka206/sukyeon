import Link from "next/link";
import type { SiteSettings } from "@/lib/content";
import { safeContentHref } from "@/lib/adminUrl";

export default function Footer({ settings }: { readonly settings: SiteSettings | null }) {
  const company = settings?.company;
  const footerColumns = settings?.footerColumns ?? [];
  return (
    <footer className="bg-navy shell pb-10 pt-15 text-[#8ea1bd]">
      <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <div className="mb-4 text-[22px] font-extrabold text-white">
            {company?.name ?? "석연MRO"}
          </div>
          <p className="m-0 mb-4 text-[14px] leading-[1.8]">
            <span className="lg:whitespace-nowrap">{settings?.footerTagline}</span>
            <br />
            {company?.address}
            <br />
            대표 {company?.ceo} · 사업자등록번호 {company?.bizNo}
          </p>
          <div className="flex flex-wrap gap-x-4.5 gap-y-1.5 text-[14px]">
            <span>TEL {company?.tel}</span>
            <span>FAX {company?.fax}</span>
            <span>{company?.email}</span>
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-[15px] font-bold text-white">{col.title}</div>
            <div className="flex flex-col gap-y-2.25 text-[14px]">
              {col.links.map((l) => (
                <Link key={l.label} href={safeContentHref(l.href)} prefetch={false} className="w-fit transition-colors hover:text-accent-on-dark">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-6 font-mono text-[13px] text-muted-dark">
        © 2026 SUKYEON MRO. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
