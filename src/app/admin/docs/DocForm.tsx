import type { AdminDoc } from "@/lib/adminData";
import { saveDocAction } from "../actions";

const input = "w-full rounded-lg border border-[#d4dae4] px-3 py-2.5 text-[15px]";
const label = "mb-1 block text-[13px] font-bold text-[#42526b]";

export default function DocForm({ item }: { item?: AdminDoc }) {
  return (
    <form action={saveDocAction} encType="multipart/form-data" className="flex flex-col gap-4">
      {item && <input type="hidden" name="_id" value={item._id} />}
      <div>
        <label className={label}>자료명</label>
        <input name="name" required defaultValue={item?.name ?? ""} className={input} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>분류</label>
          <input name="category" placeholder="이형제 / 시험성적서 …" defaultValue={item?.category ?? ""} className={input} />
        </div>
        <div>
          <label className={label}>등록일</label>
          <input name="date" placeholder="2026.05" defaultValue={item?.date ?? ""} className={input} />
        </div>
      </div>
      <div>
        <label className={label}>슬러그(URL 주소 · 비우면 자동 생성)</label>
        <input name="slug" defaultValue={item?.slug ?? ""} className={input} />
      </div>
      <label className="flex items-center gap-2 text-[14px] font-semibold text-[#42526b]">
        <input type="checkbox" name="notice" defaultChecked={item?.notice ?? false} /> 상단 고정(공지)
      </label>
      <div>
        <label className={label}>
          대표 PDF
          {item?.fileUrl && (
            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="ml-2 font-semibold text-[#22409b]">
              현재 파일 보기
            </a>
          )}
        </label>
        <input type="file" name="file" accept="application/pdf" className="text-[14px]" />
        <p className="mt-1 text-[12px] text-[#8a96ab]">
          {item ? "새 PDF를 올리면 교체됩니다(비우면 기존 파일 유지)." : "PDF를 선택하면 업로드됩니다."}
        </p>
      </div>
      <div>
        <label className={label}>요약</label>
        <input name="summary" defaultValue={item?.summary ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>본문 (문단은 빈 줄로 구분)</label>
        <textarea name="body" rows={6} defaultValue={(item?.body ?? []).join("\n\n")} className={input} />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-[#22409b] px-5 py-2.5 text-[15px] font-bold text-white hover:bg-[#18306f]"
        >
          저장
        </button>
        <a href="/admin/docs" className="rounded-lg border border-[#d4dae4] px-5 py-2.5 text-[15px] font-semibold">
          취소
        </a>
      </div>
    </form>
  );
}
