import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure, SINGLETONS } from "./structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  basePath: "/studio",
  name: "sukyeon",
  title: "석연MRO 콘텐츠",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // 싱글톤은 "새로 만들기" 목록에서 숨김
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
