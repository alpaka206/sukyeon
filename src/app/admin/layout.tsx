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
    <div className="min-h-dvh bg-[#f6f9fb] text-[#0a1b33]">
      {authed && (
        <header className="sticky top-0 z-20 border-b border-[#e2e6ed] bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
            <nav className="flex flex-wrap items-center gap-2 text-[14px] font-bold">
              <Link href="/admin" className="rounded-lg bg-[#eef2fc] px-3 py-2 font-extrabold text-[#18306f]">석연MRO 관리자</Link>
              <Link href="/admin/content" className="rounded-lg px-3 py-2 text-[#42526b] transition-colors hover:bg-[#fbfcfe] hover:text-[#22409b]">전체 콘텐츠</Link>
              <Link href="/admin/news" className="rounded-lg px-3 py-2 text-[#42526b] transition-colors hover:bg-[#fbfcfe] hover:text-[#22409b]">공지사항</Link>
              <Link href="/admin/docs" className="rounded-lg px-3 py-2 text-[#42526b] transition-colors hover:bg-[#fbfcfe] hover:text-[#22409b]">자료실</Link>
            </nav>
            <form action={logoutAction}>
              <button
                type="submit"
                className="min-h-10 rounded-lg border border-[#d4dae4] bg-white px-3 py-1.5 text-[14px] font-bold text-[#18306f] transition-colors hover:border-[#22409b] hover:bg-[#eef2fc]"
              >
                로그아웃
              </button>
            </form>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-[1180px] px-5 py-8">{children}</main>
    </div>
  );
}
