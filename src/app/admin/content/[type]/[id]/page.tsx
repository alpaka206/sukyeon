import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  CONTENT_TYPE_LABELS,
  SINGLETON_DOCUMENT_IDS,
  adminGetContentDocument,
  adminGetContentDocuments,
  isContentType,
  isFormContentType,
} from "@/lib/adminContent";
import { isAdmin } from "@/lib/adminSession";
import { writeConfigured } from "@/lib/sanityWrite";
import ContentEditor from "../../ContentEditor";

function editableDocument(
  document: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(document).filter(
      ([key]) =>
        !["_id", "_type", "_rev", "_createdAt", "_updatedAt"].includes(key),
    ),
  );
}

export default async function ContentEditPage({
  params,
}: {
  readonly params: Promise<{ type: string; id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { type: typeParam, id } = await params;
  if (typeParam === "newsPost") redirect("/admin/news");
  if (typeParam === "doc") redirect("/admin/docs");
  if (!writeConfigured) redirect("/admin/content");
  if (!isContentType(typeParam)) notFound();
  if (!isFormContentType(typeParam)) redirect("/admin/content");

  const type = typeParam;
  const singletonId = SINGLETON_DOCUMENT_IDS[type];
  if (singletonId && id !== singletonId) notFound();

  if (type === "catalog" && id === "new") {
    const activeCatalog = (await adminGetContentDocuments("catalog"))[0];
    if (activeCatalog) redirect(`/admin/content/catalog/${activeCatalog.id}`);
  }

  const existing =
    id === "new" ? null : await adminGetContentDocument(type, id);
  if (id !== "new" && !existing && !singletonId) notFound();

  const documentText = JSON.stringify(
    existing ? editableDocument(existing.document) : {},
    null,
    2,
  );
  const finalId = id === "new" ? undefined : id;
  const documentOptions =
    type === "productLineup"
      ? (await adminGetContentDocuments("doc")).map((document) => ({
          id: document.id,
          title: document.title,
        }))
      : [];

  return (
    <div>
      <div className="rounded-2xl border border-[#d8e0ec] bg-white p-5 shadow-[0_18px_44px_-36px_rgba(10,27,51,0.32)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/content/${type}`}
            className="inline-flex min-h-10 items-center rounded-lg border border-[#c7d2e5] bg-[#fbfcfe] px-3 text-[13px] font-extrabold text-[#18306f] transition-colors hover:border-[#22409b] hover:bg-[#eef2fc]"
          >
            목록으로
          </Link>
          <span className="inline-flex min-h-9 items-center rounded-lg bg-[#eef2fc] px-3 text-[13px] font-extrabold text-[#18306f]">
            {existing ? "수정 중" : "새 문서"}
          </span>
        </div>
        <div className="mt-5">
          <div className="text-[12px] font-extrabold tracking-[0.12em] text-[#22409b]">
            CONTENT EDITOR
          </div>
          <h1 className="m-0 mt-2 text-[28px] font-extrabold leading-tight text-[#0a1b33]">
            {existing
              ? `${CONTENT_TYPE_LABELS[type]} 수정`
              : `${CONTENT_TYPE_LABELS[type]} 새 문서`}
          </h1>
          <p className="m-0 mt-2 max-w-3xl text-[14px] leading-6 text-[#5a6680]">
            저장하면 사이트에 즉시 반영됩니다. 자주 수정하는 목록은 카드별
            이름과 개수를 보면서 추가·삭제·정렬할 수 있습니다.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <ContentEditor
          type={type}
          id={finalId}
          revision={existing?.revision}
          documentText={documentText}
          documentOptions={documentOptions}
        />
      </div>
    </div>
  );
}
