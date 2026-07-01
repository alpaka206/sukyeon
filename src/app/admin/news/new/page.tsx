import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import NewsForm from "../NewsForm";

export default async function NewNewsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div>
      <h1 className="m-0 mb-6 text-[26px] font-extrabold">새 공지</h1>
      <NewsForm />
    </div>
  );
}
