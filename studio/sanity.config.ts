import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure, SINGLETONS } from "./structure";

// projectId/dataset 은 studio/.env 의 SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET 로 주입.
export default defineConfig({
  name: "default",
  title: "석연MRO 콘텐츠",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // 싱글톤은 "새로 만들기" 목록에서 숨김 (구조에서 단일 문서로만 편집)
    templates: (prev) => prev.filter((t) => !SINGLETONS.includes(t.schemaType)),
  },
  document: {
    // 싱글톤은 삭제·복제·게시취소 액션 제거
    actions: (input, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? input.filter(({ action }) => action !== "delete" && action !== "duplicate" && action !== "unpublish")
        : input,
  },
});
