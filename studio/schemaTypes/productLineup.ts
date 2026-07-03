import { defineType, defineField } from "sanity";

export default defineType({
  name: "productLineup",
  title: "제품 라인업 (이형제 · 프란자오일)",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "구분 키",
      type: "string",
      description: "release = 이형제, pranza = 프란자오일 (변경 금지)",
      options: { list: [
        { title: "이형제 (release)", value: "release" },
        { title: "프란자오일 (pranza)", value: "pranza" },
      ] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "eyebrow", title: "영문 라벨", type: "string", description: "예: RELEASE AGENT" }),
    defineField({ name: "title", title: "제목", type: "string", validation: (r) => r.required() }),
    defineField({ name: "brand", title: "브랜드명", type: "string", description: "예: CAST ONE / LUBE ONE" }),
    defineField({ name: "intro", title: "소개 문단", type: "text", rows: 3 }),
    defineField({
      name: "bullets",
      title: "특징 목록",
      type: "array",
      of: [{ type: "string" }],
      description: "‘ — ’(공백-대시-공백) 앞부분은 굵게 표시됩니다",
    }),
    defineField({
      name: "items",
      title: "제품 목록",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "code", title: "제품명/코드", type: "string", validation: (r) => r.required() },
            { name: "image", title: "제품 이미지", type: "image", options: { hotspot: true } },
            { name: "summary", title: "요약", type: "text", rows: 2 },
            { name: "points", title: "특징", type: "array", of: [{ type: "string" }] },
            {
              name: "documents",
              title: "관련 자료",
              type: "array",
              of: [{
                type: "object",
                fields: [
                  { name: "label", title: "이름", type: "string" },
                  { name: "href", title: "링크", type: "string" },
                ],
                preview: { select: { title: "label", subtitle: "href" } },
              }],
            },
          ],
          preview: { select: { title: "code", media: "image" } },
        },
      ],
    }),
    defineField({ name: "order", title: "정렬 순서(작을수록 먼저)", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "정렬 순서", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "brand" } },
});
