import { defineType, defineField } from "sanity";

export default defineType({
  name: "catalog",
  title: "카탈로그",
  type: "document",
  fields: [
    defineField({ name: "title", title: "제목", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "표지 부제", type: "string", description: "예: CAST ONE · LUBE ONE · 2026" }),
    defineField({ name: "file", title: "카탈로그 PDF", type: "file", options: { accept: "application/pdf" } }),
  ],
  preview: { select: { title: "title" } },
});
