import { NextRequest, NextResponse } from "next/server";

// GitHub OAuth 콜백 — code를 access token으로 교환한 뒤,
// CMS 창(opener)에 postMessage로 토큰을 전달하는 표준 Decap/Sveltia 핸드셰이크.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function page(status: "success" | "error", payload: unknown) {
  const content = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html><html><body><script>
  (function () {
    function receiveMessage(e) {
      window.opener && window.opener.postMessage(${JSON.stringify(content)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener && window.opener.postMessage("authorizing:github", "*");
  })();
  </script><p>로그인 처리 중입니다. 이 창은 자동으로 닫힙니다…</p></body></html>`;
}

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  const html = (body: string) =>
    new NextResponse(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });

  if (!code || !clientId || !clientSecret) {
    return html(page("error", { message: "OAuth 설정 또는 code가 없습니다." }));
  }

  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string };

    if (!data.access_token) {
      return html(page("error", { message: data.error || "토큰 발급 실패" }));
    }
    return html(page("success", { token: data.access_token, provider: "github" }));
  } catch {
    return html(page("error", { message: "토큰 교환 중 오류가 발생했습니다." }));
  }
}
