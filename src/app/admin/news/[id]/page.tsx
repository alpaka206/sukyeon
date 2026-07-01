import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import { adminGetNewsById } from "@/lib/adminData";
import NewsForm from "../NewsForm";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const item = await adminGetNewsById(id);
  if (!item) notFound();
  return (
    <div>
      <h1 className="m-0 mb-6 text-[26px] font-extrabold">공지 수정</h1>
      <NewsForm item={item} />
    </div>
  );
}
