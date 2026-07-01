import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { adminGetNews } from "@/lib/adminData";
import { deleteNewsAction } from "../actions";

export default async function NewsListPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const items = await adminGetNews();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="m-0 text-[26px] font-extrabold">공지사항</h1>
        <Link
          href="/admin/news/new"
          className="rounded-lg bg-[#22409b] px-4 py-2 text-[14px] font-bold text-white hover:bg-[#18306f]"
        >
          + 새 공지
        </Link>
      </div>
      <div className="divide-y divide-[#eef1f5] rounded-2xl border border-[#e2e6ed] bg-white">
        {items.length === 0 && (
          <p className="m-0 p-6 text-[14px] text-[#8a96ab]">등록된 공지가 없습니다.</p>
        )}
        {items.map((n) => (
          <div key={n._id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold">{n.title}</div>
              <div className="text-[13px] text-[#8a96ab]">
                {n.category} · {n.date || "날짜 없음"}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/admin/news/${n._id}`}
                className="rounded-md border border-[#d4dae4] px-3 py-1.5 text-[13px] font-semibold"
              >
                수정
              </Link>
              <form action={deleteNewsAction}>
                <input type="hidden" name="_id" value={n._id} />
                <button
                  type="submit"
                  className="rounded-md border border-[#f0c9c9] px-3 py-1.5 text-[13px] font-semibold text-[#b3261e]"
                >
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
