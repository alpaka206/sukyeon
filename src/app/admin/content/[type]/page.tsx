import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CONTENT_TYPE_LABELS, SINGLETON_DOCUMENT_IDS, adminGetContentDocuments, isContentType } from "@/lib/adminContent";
import { isAdmin } from "@/lib/adminSession";
import { writeConfigured } from "@/lib/sanityWrite";
import { deleteContentAction } from "../../actions";

export default async function ContentListPage({ params }: { readonly params: Promise<{ type: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { type: typeParam } = await params;
  if (typeParam === "newsPost") redirect("/admin/news");
  if (typeParam === "doc") redirect("/admin/docs");
  if (!writeConfigured) redirect("/admin/content");
  if (!isContentType(typeParam)) notFound();

  const type = typeParam;
  const singletonId = SINGLETON_DOCUMENT_IDS[type];
  const documents = await adminGetContentDocuments(type);
  const isCatalog = type === "catalog";
  const createHref = singletonId ? `/admin/content/${type}/${singletonId}` : `/admin/content/${type}/new`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-[26px] font-extrabold">{CONTENT_TYPE_LABELS[type]}</h1>
          <p className="mt-2 text-[14px] text-[#5a6680]">모든 필드와 배열, 연결 문서를 편집할 수 있습니다.</p>
        </div>
        {(documents.length === 0 || (!singletonId && !isCatalog)) && (
          <Link href={createHref} className="rounded-lg bg-[#22409b] px-4 py-2 text-[14px] font-bold text-white hover:bg-[#18306f]">+ 새 문서</Link>
        )}
      </div>
      <div className="divide-y divide-[#eef1f5] rounded-2xl border border-[#e2e6ed] bg-white">
        {documents.length === 0 && <p className="m-0 p-6 text-[14px] text-muted">등록된 문서가 없습니다.</p>}
        {documents.map((document) => (
          <div key={document.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold">{document.title}</div>
              <div className="mt-1 text-[13px] text-muted">최근 수정 {new Date(document.updatedAt).toLocaleString("ko-KR")}</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={`/admin/content/${type}/${document.id}`} className="rounded-md border border-[#d4dae4] px-3 py-1.5 text-[13px] font-semibold">수정</Link>
              {!singletonId && !isCatalog && (
                <form action={deleteContentAction}>
                  <input type="hidden" name="type" value={type} />
                  <input type="hidden" name="id" value={document.id} />
                  <input type="hidden" name="revision" value={document.revision} />
                  <button type="submit" className="rounded-md border border-[#f0c9c9] px-3 py-1.5 text-[13px] font-semibold text-[#b3261e]">삭제</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
