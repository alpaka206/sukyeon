import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import KakaoRoughMap from "@/components/KakaoRoughMap";
import PageHeader from "@/components/PageHeader";
import { safeContentHref } from "@/lib/adminUrl";
import { getSiteSettings } from "@/lib/content";
import { buildKakaoMapSearchHref } from "@/lib/maps";

export const metadata: Metadata = { title: "온라인 견적·문의" };

export default async function ContactPage() {
  const c = (await getSiteSettings())?.company;
  const mapHref = buildKakaoMapSearchHref(c?.address);

  return (
    <>
      <PageHeader title="온라인 견적·문의" />
      <div className="grid grid-cols-1 items-start gap-12 shell py-16 pb-20 lg:grid-cols-[1.3fr_0.7fr]">
        <ContactForm />

        <div className="flex flex-col gap-4.5">
          <div className="relative overflow-hidden rounded-[18px] bg-navy p-8 text-white">
            <h3 className="relative m-0 mb-4.5 text-[20px] font-extrabold">전화 문의</h3>
            <a
              href={safeContentHref(`tel:${c?.tel ?? ""}`)}
              className="relative mb-1.5 block text-[26px] font-extrabold text-accent-on-dark"
            >
              {c?.tel}
            </a>
            <div className="relative text-[14px] text-[#b6c3d6]">FAX {c?.fax}</div>
            <a
              href={safeContentHref(`mailto:${c?.email ?? ""}`)}
              className="relative mt-1 block text-[14px] text-accent-on-dark"
            >
              {c?.email}
            </a>
            <div className="relative mt-3.5 text-[14px] leading-[1.6] text-[#b6c3d6]">
              {c?.hours}
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-[#eaeef3]">
            <div className="h-75 bg-[#eef2f6] lg:h-95">
              <KakaoRoughMap
                placeName="ㅤㅤㅤㅤ석연 MROㅤㅤㅤㅤ"
                labelSearchText="인천 서해구 염곡로15번길 16"
                fallbackHref={mapHref}
                label="석연MRO 찾아오시는 길"
              />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="m-0 mb-3 text-[18px] font-bold text-navy">찾아오시는 길</h3>
              <p className="m-0 mb-4 text-[15px] leading-[1.7] text-[#5a6680]">
                {c?.address}
              </p>
              <a
                href={safeContentHref(mapHref)}
                target="_blank"
                rel="noopener noreferrer"
                className="link-teal text-[14px] font-bold text-[#22409b]"
              >
                카카오맵에서 크게 보기 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
