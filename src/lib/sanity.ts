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
      useCdn: true, // 공개 콘텐츠 → CDN 캐시 사용(읽기 토큰 불필요)
    })
  : null;
