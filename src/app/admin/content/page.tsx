import Link from "next/link";
import { redirect } from "next/navigation";
import { CONTENT_TYPES, CONTENT_TYPE_LABELS, adminGetContentDocuments } from "@/lib/adminContent";
import { isAdmin } from "@/lib/adminSession";
import { writeConfigured } from "@/lib/sanityWrite";

export default async function ContentHomePage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const counts = writeConfigured
    ? await Promise.all(CONTENT_TYPES.map(async (type) => [type, (await adminGetContentDocuments(type)).length] as const))
    : [];
  const countByType = new Map(counts);

  return (
    <div>
      <h1 className="m-0 text-[26px] font-extrabold">전체 콘텐츠 관리</h1>
      <p className="mt-2 text-[15px] leading-[1.6] text-[#5a6680]">Sanity Studio에 있던 모든 콘텐츠를 여기서 관리합니다.</p>
      {!writeConfigured && (
        <p className="mt-5 rounded-lg bg-[#fff4e5] px-4 py-3 text-[14px] leading-[1.6] text-[#8a5a00]">
          콘텐츠를 저장하려면 <code>SANITY_API_WRITE_TOKEN</code>을 설정해야 합니다.
        </p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTENT_TYPES.map((type) => (
          <Link key={type} href={`/admin/content/${type}`} className="rounded-2xl border border-[#e2e6ed] bg-white p-5 transition-colors hover:border-[#22409b]">
            <div className="text-[15px] font-bold">{CONTENT_TYPE_LABELS[type]}</div>
            <div className="mt-2 text-[14px] text-[#8a96ab]">{countByType.get(type) ?? 0}개 문서</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
