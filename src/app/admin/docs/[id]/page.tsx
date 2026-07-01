import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { adminGetDocById } from "@/lib/adminData";
import DocForm from "../DocForm";
import { addAttachmentAction, removeAttachmentAction } from "../../actions";

const input = "w-full rounded-lg border border-[#d4dae4] px-3 py-2.5 text-[15px]";

export default async function EditDocPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const item = await adminGetDocById(id);
  if (!item) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="m-0 mb-6 text-[26px] font-extrabold">자료 수정</h1>
        <DocForm item={item} />
      </div>

      <section>
        <h2 className="m-0 mb-4 text-[18px] font-extrabold">첨부 PDF (여러 개)</h2>
        <div className="mb-4 divide-y divide-[#eef1f5] rounded-2xl border border-[#e2e6ed] bg-white">
          {item.attachments.length === 0 && (
            <p className="m-0 p-4 text-[14px] text-[#8a96ab]">첨부된 PDF가 없습니다.</p>
          )}
          {item.attachments.map((a) => (
            <div key={a._key} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <span className="text-[15px] font-semibold">{a.name}</span>
                {a.fileUrl && (
                  <a
                    href={a.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-3 text-[13px] font-semibold text-[#22409b]"
                  >
                    보기
                  </a>
                )}
              </div>
              <form action={removeAttachmentAction}>
                <input type="hidden" name="_id" value={item._id} />
                <input type="hidden" name="_key" value={a._key} />
                <button
                  type="submit"
                  className="rounded-md border border-[#f0c9c9] px-3 py-1.5 text-[13px] font-semibold text-[#b3261e]"
                >
                  삭제
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={addAttachmentAction}
          encType="multipart/form-data"
          className="flex flex-col gap-3 rounded-2xl border border-[#e2e6ed] bg-white p-4 sm:flex-row sm:items-end"
        >
          <input type="hidden" name="_id" value={item._id} />
          <div className="flex-1">
            <label className="mb-1 block text-[13px] font-bold text-[#42526b]">이름</label>
            <input name="name" placeholder="예: 국문 MSDS" className={input} />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[13px] font-bold text-[#42526b]">PDF 파일</label>
            <input type="file" name="file" accept="application/pdf" required className="text-[14px]" />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#0a1b33] px-5 py-2.5 text-[15px] font-bold text-white hover:bg-[#13294a]"
          >
            첨부 추가
          </button>
        </form>
      </section>
    </div>
  );
}
