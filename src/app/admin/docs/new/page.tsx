import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminSession";
import DocForm from "../DocForm";

export default async function NewDocPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div>
      <h1 className="m-0 mb-6 text-[26px] font-extrabold">새 자료</h1>
      <p className="m-0 mb-6 text-[14px] text-[#8a96ab]">먼저 저장하면 추가 첨부 PDF를 올릴 수 있는 화면으로 이동합니다.</p>
      <DocForm />
    </div>
  );
}
