import { createClient, type SanityClient } from "@sanity/client";

// Sanity를 콘텐츠 단일 원본으로 사용. 프로젝트 ID 미설정이면 클라이언트는 null → 조회 시 빈 값 반환.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityEnabled = Boolean(projectId);

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      // 조회는 전부 서버 재검증 시점에 일어나므로 CDN 캐시를 쓰면
      // 저장 직후 낡은 콘텐츠가 페이지에 다시 캐시된다 → 항상 라이브 API 사용.
      useCdn: false,
    })
  : null;
