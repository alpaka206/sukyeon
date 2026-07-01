import "server-only";
import { createClient, type SanityClient } from "@sanity/client";

// 쓰기 전용 클라이언트(서버 전용). SANITY_API_WRITE_TOKEN이 있어야 활성화.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

export const writeConfigured = Boolean(projectId && token);

export const writeClient: SanityClient | null =
  projectId && token
    ? createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false })
    : null;
