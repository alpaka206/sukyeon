import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { adminGetDocs } from "@/lib/adminData";
import { deleteDocAction } from "../actions";

export default async function DocsListPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const items = await adminGetDocs();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="m-0 text-[26px] font-extrabold">자료실</h1>
        <Link
          href="/admin/docs/new"
          className="rounded-lg bg-[#22409b] px-4 py-2 text-[14px] font-bold text-white hover:bg-[#18306f]"
        >
          + 새 자료
        </Link>
      </div>
      <div className="divide-y divide-[#eef1f5] rounded-2xl border border-[#e2e6ed] bg-white">
        {items.length === 0 && (
          <p className="m-0 p-6 text-[14px] text-[#8a96ab]">등록된 자료가 없습니다.</p>
        )}
        {items.map((d) => {
          const pdfCount = (d.fileUrl ? 1 : 0) + d.attachments.length;
          return (
            <div key={d._id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {d.notice && (
                    <span className="rounded bg-[#eef2fc] px-1.5 py-0.5 text-[11px] font-bold text-[#22409b]">
                      공지
                    </span>
                  )}
                  <span className="truncate text-[15px] font-bold">{d.name}</span>
                </div>
                <div className="text-[13px] text-[#8a96ab]">
                  {d.category || "분류 없음"} · {d.date || "날짜 없음"} · PDF {pdfCount}개
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/docs/${d._id}`}
                  className="rounded-md border border-[#d4dae4] px-3 py-1.5 text-[13px] font-semibold"
                >
                  수정
                </Link>
                <form action={deleteDocAction}>
                  <input type="hidden" name="_id" value={d._id} />
                  <button
                    type="submit"
                    className="rounded-md border border-[#f0c9c9] px-3 py-1.5 text-[13px] font-semibold text-[#b3261e]"
                  >
                    삭제
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
