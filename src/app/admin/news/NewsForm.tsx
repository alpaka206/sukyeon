import type { AdminNews } from "@/lib/adminData";
import { saveNewsAction } from "../actions";

const input = "w-full rounded-lg border border-[#d4dae4] px-3 py-2.5 text-[15px]";
const label = "mb-1 block text-[13px] font-bold text-[#42526b]";

export default function NewsForm({ item }: { item?: AdminNews }) {
  return (
    <form action={saveNewsAction} className="flex flex-col gap-4">
      {item && <input type="hidden" name="_id" value={item._id} />}
      <div>
        <label className={label}>제목</label>
        <input name="title" required defaultValue={item?.title ?? ""} className={input} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>분류</label>
          <select name="category" defaultValue={item?.category ?? "일반"} className={input}>
            {["일반", "자료", "제품", "인증"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>날짜</label>
          <input name="date" placeholder="2026.05.20" defaultValue={item?.date ?? ""} className={input} />
        </div>
      </div>
      <div>
        <label className={label}>슬러그(URL 주소 · 비우면 자동 생성)</label>
        <input name="slug" defaultValue={item?.slug ?? ""} className={input} />
      </div>
      <label className="flex items-center gap-2 text-[14px] font-semibold text-[#42526b]">
        <input type="checkbox" name="accent" defaultChecked={item?.accent ?? false} /> 강조(파란 뱃지로 표시)
      </label>
      <div>
        <label className={label}>요약</label>
        <input name="summary" defaultValue={item?.summary ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>본문 (문단은 빈 줄로 구분)</label>
        <textarea name="body" rows={8} defaultValue={(item?.body ?? []).join("\n\n")} className={input} />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-[#22409b] px-5 py-2.5 text-[15px] font-bold text-white hover:bg-[#18306f]"
        >
          저장
        </button>
        <a href="/admin/news" className="rounded-lg border border-[#d4dae4] px-5 py-2.5 text-[15px] font-semibold">
          취소
        </a>
      </div>
    </form>
  );
}
