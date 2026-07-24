import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const KAKAO_SCRIPT_SOURCES = [
  "https://*.daumcdn.net",
  "https://*.kakaocdn.net",
];

const KAKAO_RESOURCE_SOURCES = [
  "https://*.daum.net",
  "https://*.daumcdn.net",
  "https://*.kakao.com",
  "https://*.kakaocdn.net",
];

// /studio의 조회·업로드·실시간 연결과 Sanity 인증 화면에 필요하다.
const SANITY_CONNECT_SOURCES = [
  "https://api.sanity.io",
  "https://*.api.sanity.io",
  "https://apicdn.sanity.io",
  "https://*.apicdn.sanity.io",
  "https://cdn.sanity.io",
  "https://www.sanity.io",
  "https://*.sanity.io",
  "https://*.sanity-cdn.com",
  "wss://api.sanity.io",
  "wss://*.api.sanity.io",
];

const SANITY_FRAME_SOURCES = [
  "https://www.sanity.io",
  "https://*.sanity.io",
];

function toHttpSources(sources: readonly string[]): string[] {
  return sources.map((source) => source.replace(/^https:/, "http:"));
}

function buildContentSecurityPolicy(
  isDevelopment: boolean,
  diagnosticsEnabled: boolean,
): string {
  // RoughMap loader가 현재 페이지 프로토콜을 따라 보조 스크립트를 불러오므로
  // http://localhost 개발 환경에서는 Daum/Kakao의 http 리소스도 개발 CSP에만 허용한다.
  const developmentKakaoScriptSources = isDevelopment
    ? toHttpSources(KAKAO_SCRIPT_SOURCES)
    : [];
  const developmentKakaoResourceSources = isDevelopment
    ? toHttpSources(KAKAO_RESOURCE_SOURCES)
    : [];
  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
    ...KAKAO_SCRIPT_SOURCES,
    ...developmentKakaoScriptSources,
  ];

  const connectSources = [
    "'self'",
    ...KAKAO_RESOURCE_SOURCES,
    ...developmentKakaoResourceSources,
    ...SANITY_CONNECT_SOURCES,
    ...(isDevelopment ? ["ws:", "wss:"] : []),
    ...(diagnosticsEnabled ? ["https://www.react-grab.com"] : []),
  ];

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    `style-src 'self' 'unsafe-inline' ${[...KAKAO_SCRIPT_SOURCES, ...developmentKakaoScriptSources].join(" ")}`,
    `img-src 'self' data: blob: https://cdn.sanity.io ${[...KAKAO_RESOURCE_SOURCES, ...developmentKakaoResourceSources].join(" ")}`,
    `font-src 'self' data: ${[...KAKAO_SCRIPT_SOURCES, ...developmentKakaoScriptSources].join(" ")}`,
    `connect-src ${connectSources.join(" ")}`,
    `frame-src 'self' ${[...KAKAO_RESOURCE_SOURCES, ...developmentKakaoResourceSources, ...SANITY_FRAME_SOURCES].join(" ")}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ];

  return directives.join("; ");
}

export default function nextConfig(phase: string): NextConfig {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER;
  const diagnosticsEnabled =
    isDevelopment && process.env.NEXT_PUBLIC_ENABLE_REACT_DIAGNOSTICS === "1";
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const contentSecurityPolicy = buildContentSecurityPolicy(
    isDevelopment,
    diagnosticsEnabled,
  );

  const securityHeaders = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    ...(isDevelopment
      ? []
      : [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]),
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },
  ];

  return {
    poweredByHeader: false,
    images: {
      remotePatterns:
        projectId && dataset
          ? [
              {
                protocol: "https",
                hostname: "cdn.sanity.io",
                pathname: `/images/${projectId}/${dataset}/**`,
              },
            ]
          : [],
      formats: ["image/avif", "image/webp"],
      qualities: [60, 75, 85, 100],
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    },
  };
}
