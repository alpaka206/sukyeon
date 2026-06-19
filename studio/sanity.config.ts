import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

// projectId/dataset 은 studio/.env 의 SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET 로 주입.
export default defineConfig({
  name: "default",
  title: "석연MRO 콘텐츠",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
