import { createClient, type SanityClient } from "@sanity/client";

// Sanity 프로젝트 ID가 환경변수에 있으면 활성화, 없으면 로컬 JSON 폴백(src/content/*).
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
