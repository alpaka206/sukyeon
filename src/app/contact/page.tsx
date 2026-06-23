import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "온라인 견적·문의" };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="CONTACT" title="온라인 견적·문의" />
      <div className="grid grid-cols-1 items-start gap-12 shell py-16 pb-20 lg:grid-cols-[1.3fr_0.7fr]">
        <ContactForm />

        <div className="flex flex-col gap-[18px]">
          <div className="relative overflow-hidden rounded-[18px] bg-[#0a1b33] p-8 text-white">
            <h3 className="relative m-0 mb-[18px] text-[20px] font-extrabold">전화 문의</h3>
            <a href="tel:032-575-2492" className="relative mb-1.5 block text-[26px] font-extrabold text-[#4f74e6]">
              032-575-2492
            </a>
            <div className="relative text-[14px] text-[#b6c3d6]">FAX 032-575-2493</div>
            <a href="mailto:sukyeonmro@naver.com" className="relative mt-1 block text-[14px] text-[#4f74e6]">
              sukyeonmro@naver.com
            </a>
            <div className="relative mt-3.5 text-[14px] leading-[1.6] text-[#b6c3d6]">
              평일 09:00 – 18:00
              <br />
              점심 12:00 – 13:00
            </div>
          </div>

          <div className="rounded-[18px] border border-[#eaeef3] p-8">
            <h3 className="m-0 mb-3 text-[18px] font-bold text-[#0a1b33]">찾아오시는 길</h3>
            <p className="m-0 mb-4 text-[15px] leading-[1.7] text-[#5a6680]">
              인천광역시 서구 염곡로 15번길 16
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
