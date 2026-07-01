import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/adminSession";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  return (
    <div className="min-h-screen bg-[#f6f9fb] text-[#0a1b33]">
      {authed && (
        <header className="border-b border-[#e2e6ed] bg-white">
          <div className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-3">
            <nav className="flex items-center gap-4 text-[15px] font-semibold">
              <Link href="/admin" className="font-extrabold">석연MRO 관리자</Link>
              <Link href="/admin/news" className="text-[#42526b] hover:text-[#22409b]">공지사항</Link>
              <Link href="/admin/docs" className="text-[#42526b] hover:text-[#22409b]">자료실</Link>
            </nav>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-[#e2e6ed] px-3 py-1.5 text-[14px] font-semibold hover:bg-[#f6f9fb]"
              >
                로그아웃
              </button>
            </form>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-[1000px] px-5 py-8">{children}</main>
    </div>
  );
}
