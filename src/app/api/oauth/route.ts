import { NextRequest, NextResponse } from "next/server";

// GitHub OAuth 시작 — CMS(/admin)가 이 주소를 열면 GitHub 로그인으로 보냅니다.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("GITHUB_OAUTH_CLIENT_ID 환경변수가 설정되지 않았습니다.", {
      status: 500,
    });
  }

  const origin = new URL(req.url).origin;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/oauth/callback`,
    scope: "repo,user",
    allow_signup: "false",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
