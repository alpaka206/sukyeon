import { redirect } from "next/navigation";
import { loginAction } from "../actions";
import { adminConfigured } from "@/lib/adminAuth";
import { isAdmin } from "@/lib/adminSession";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const sp = await searchParams;
  const configured = adminConfigured();

  return (
    <div className="mx-auto mt-12 max-w-[380px] rounded-2xl border border-[#e2e6ed] bg-white p-8">
      <h1 className="m-0 mb-6 text-[22px] font-extrabold">관리자 로그인</h1>
      {!configured && (
        <p className="mb-4 rounded-lg bg-[#fff4e5] px-3 py-2 text-[13px] leading-[1.6] text-[#8a5a00]">
          환경변수 ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SESSION_SECRET를 먼저 설정하세요.
        </p>
      )}
      {sp?.error && (
        <p className="mb-4 rounded-lg bg-[#fdecec] px-3 py-2 text-[13px] text-[#b3261e]">
          아이디 또는 비밀번호가 올바르지 않습니다.
        </p>
      )}
      <form action={loginAction} className="flex flex-col gap-3">
        <input
          name="username"
          placeholder="아이디"
          autoComplete="username"
          required
          className="rounded-lg border border-[#d4dae4] px-3 py-2.5 text-[15px]"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          required
          className="rounded-lg border border-[#d4dae4] px-3 py-2.5 text-[15px]"
        />
        <button
          type="submit"
          className="mt-1 rounded-lg bg-[#22409b] px-4 py-2.5 text-[15px] font-bold text-white hover:bg-[#18306f]"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
