"use client";

import { useActionState } from "react";
import type { ContentType } from "@/lib/adminContent";
import { saveContentAction, uploadContentAssetAction } from "../actions";

type AssetUploadState = {
  readonly error: string;
  readonly reference: string;
};

const EMPTY_UPLOAD_STATE: AssetUploadState = { error: "", reference: "" };

export default function ContentEditor({
  type,
  id,
  revision,
  documentText,
}: {
  readonly type: ContentType;
  readonly id?: string;
  readonly revision?: string;
  readonly documentText: string;
}) {
  const [uploadState, uploadAction, isUploading] = useActionState(
    uploadContentAssetAction,
    EMPTY_UPLOAD_STATE,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <form action={saveContentAction} className="rounded-2xl border border-[#e2e6ed] bg-white p-5">
        <input type="hidden" name="type" value={type} />
        {id && <input type="hidden" name="id" value={id} />}
        {revision && <input type="hidden" name="revision" value={revision} />}
        <label htmlFor="document" className="mb-2 block text-[14px] font-bold text-[#0a1b33]">
          콘텐츠 데이터
        </label>
        <p className="mb-3 text-[13px] leading-[1.6] text-[#5a6680]">
          문서의 모든 항목을 JSON으로 수정할 수 있습니다. <code>_id</code>, <code>_type</code>,
          <code>_createdAt</code> 등 시스템 항목은 저장 시 자동으로 처리됩니다.
        </p>
        <textarea
          id="document"
          name="document"
          required
          defaultValue={documentText}
          spellCheck={false}
          className="min-h-[620px] w-full rounded-lg border border-[#d4dae4] bg-[#0a1b33] p-4 font-mono text-[13px] leading-6 text-[#eef2fc] outline-none focus:border-[#4f74e6]"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" className="rounded-lg bg-[#22409b] px-5 py-2.5 text-[15px] font-bold text-white hover:bg-[#18306f]">
            저장
          </button>
          <a href={`/admin/content/${type}`} className="rounded-lg border border-[#d4dae4] px-5 py-2.5 text-[15px] font-semibold">
            목록으로
          </a>
        </div>
      </form>

      <aside className="h-fit rounded-2xl border border-[#e2e6ed] bg-white p-5">
        <h2 className="m-0 text-[17px] font-extrabold">이미지·파일 업로드</h2>
        <p className="mt-2 text-[13px] leading-[1.6] text-[#5a6680]">
          업로드 후 아래 참조값을 복사해 이미지 또는 파일 필드에 붙여 넣으세요.
        </p>
        <form action={uploadAction} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="type" value={type} />
          <input
            name="asset"
            type="file"
            required
            accept="image/*,application/pdf"
            className="block w-full text-[13px] text-[#42526b] file:mr-3 file:rounded-md file:border-0 file:bg-[#eef2fc] file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-[#22409b]"
          />
          <button type="submit" disabled={isUploading} className="rounded-lg border border-[#22409b] px-4 py-2 text-[14px] font-bold text-[#22409b] disabled:cursor-not-allowed disabled:opacity-60">
            {isUploading ? "업로드 중..." : "업로드"}
          </button>
        </form>
        {uploadState.error && <p className="mt-4 text-[13px] font-semibold text-[#b3261e]">{uploadState.error}</p>}
        {uploadState.reference && (
          <div className="mt-4">
            <p className="mb-2 text-[13px] font-bold text-[#0a1b33]">붙여 넣을 값</p>
            <pre className="overflow-x-auto rounded-lg bg-[#eef2fc] p-3 text-[11px] leading-5 text-[#18306f]">
              {uploadState.reference}
            </pre>
          </div>
        )}
      </aside>
    </div>
  );
}
