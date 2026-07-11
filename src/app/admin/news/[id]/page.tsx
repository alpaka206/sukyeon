import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { adminGetNewsById } from "@/lib/adminData";
import NewsForm from "../NewsForm";

export default async function EditNewsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const item = await adminGetNewsById(id);
  const { error } = await searchParams;
  if (!item) notFound();
  return (
    <div>
      <h1 className="m-0 mb-6 text-[26px] font-extrabold">공지 수정</h1>
      {error && <p role="alert" className="mb-4 rounded-lg border border-[#f0c9c9] bg-[#fff7f7] p-3 text-[14px] font-semibold text-[#b3261e]">{error}</p>}
      <NewsForm item={item} />
    </div>
  );
}
