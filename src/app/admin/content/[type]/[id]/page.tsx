import { notFound, redirect } from "next/navigation";
import { CONTENT_TYPE_LABELS, SINGLETON_DOCUMENT_IDS, adminGetContentDocument, isContentType } from "@/lib/adminContent";
import { isAdmin } from "@/lib/adminSession";
import { writeConfigured } from "@/lib/sanityWrite";
import ContentEditor from "../../ContentEditor";

function editableDocument(document: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(document).filter(([key]) => !["_id", "_type", "_rev", "_createdAt", "_updatedAt"].includes(key)),
  );
}

export default async function ContentEditPage({ params }: { readonly params: Promise<{ type: string; id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!writeConfigured) redirect("/admin/content");
  const { type: typeParam, id } = await params;
  if (!isContentType(typeParam)) notFound();

  const type = typeParam;
  const singletonId = SINGLETON_DOCUMENT_IDS[type];
  if (singletonId && id !== singletonId) notFound();

  const existing = id === "new" ? null : await adminGetContentDocument(type, id);
  if (id !== "new" && !existing && !singletonId) notFound();

  const documentText = JSON.stringify(existing ? editableDocument(existing.document) : {}, null, 2);
  const finalId = id === "new" ? undefined : id;

  return (
    <div>
      <h1 className="m-0 text-[26px] font-extrabold">{existing ? `${CONTENT_TYPE_LABELS[type]} 수정` : `${CONTENT_TYPE_LABELS[type]} 새 문서`}</h1>
      <p className="mt-2 text-[14px] text-[#5a6680]">저장하면 사이트에 즉시 반영됩니다.</p>
      <div className="mt-6"><ContentEditor type={type} id={finalId} revision={existing?.revision} documentText={documentText} /></div>
    </div>
  );
}
