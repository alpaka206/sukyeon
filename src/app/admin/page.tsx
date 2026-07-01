import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { writeConfigured } from "@/lib/sanityWrite";
import { adminGetNews, adminGetDocs } from "@/lib/adminData";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");

  const ready = writeConfigured;
  const [news, docs] = ready
    ? await Promise.all([adminGetNews(), adminGetDocs()])
    : [[], []];

  return (
    <div>
      <h1 className="m-0 mb-6 text-[26px] font-extrabold">대시보드</h1>
      {!ready && (
        <p className="mb-6 rounded-lg bg-[#fff4e5] px-4 py-3 text-[14px] leading-[1.6] text-[#8a5a00]">
          Sanity 쓰기 토큰(<code>SANITY_API_WRITE_TOKEN</code>)이 아직 설정되지 않았습니다. 설정 전에는
          저장·업로드가 동작하지 않습니다.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/news"
          className="rounded-2xl border border-[#e2e6ed] bg-white p-6 transition-colors hover:border-[#22409b]"
        >
          <div className="text-[15px] font-semibold text-[#8a96ab]">공지사항</div>
          <div className="mt-1 text-[32px] font-extrabold">
            {news.length}
            <span className="text-[16px] font-semibold text-[#8a96ab]"> 건</span>
          </div>
        </Link>
        <Link
          href="/admin/docs"
          className="rounded-2xl border border-[#e2e6ed] bg-white p-6 transition-colors hover:border-[#22409b]"
        >
          <div className="text-[15px] font-semibold text-[#8a96ab]">자료실(PDF)</div>
          <div className="mt-1 text-[32px] font-extrabold">
            {docs.length}
            <span className="text-[16px] font-semibold text-[#8a96ab]"> 건</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
