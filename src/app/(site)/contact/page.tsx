import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { safeContentHref } from "@/lib/adminUrl";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "온라인 견적·문의" };

export default async function ContactPage() {
  const c = (await getSiteSettings())?.company;
  return (
    <>
      <PageHeader title="온라인 견적·문의" />
      <div className="grid grid-cols-1 items-start gap-12 shell py-16 pb-20 lg:grid-cols-[1.3fr_0.7fr]">
        <ContactForm />

        <div className="flex flex-col gap-4.5">
          <div className="relative overflow-hidden rounded-[18px] bg-navy p-8 text-white">
            <h3 className="relative m-0 mb-4.5 text-[20px] font-extrabold">전화 문의</h3>
            <a href={safeContentHref(`tel:${c?.tel ?? ""}`)} className="relative mb-1.5 block text-[26px] font-extrabold text-accent-on-dark">
              {c?.tel}
            </a>
            <div className="relative text-[14px] text-[#b6c3d6]">FAX {c?.fax}</div>
            <a href={safeContentHref(`mailto:${c?.email ?? ""}`)} className="relative mt-1 block text-[14px] text-accent-on-dark">
              {c?.email}
            </a>
            <div className="relative mt-3.5 text-[14px] leading-[1.6] text-[#b6c3d6]">
              {c?.hours}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#eaeef3] p-8">
            <h3 className="m-0 mb-3 text-[18px] font-bold text-navy">찾아오시는 길</h3>
            <p className="m-0 mb-4 text-[15px] leading-[1.7] text-[#5a6680]">
              {c?.address}
            </p>
            <Link href="/about#sec-location" className="link-teal text-[14px] font-bold text-[#22409b]">
              지도 보기 →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
