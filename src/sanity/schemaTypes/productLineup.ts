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
            {
              name: "visible",
              title: "사이트에 노출",
              type: "boolean",
              initialValue: true,
              description: "끄면 사이트에서만 숨겨지고 Studio에는 그대로 남습니다",
            },
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
                  { name: "label", title: "표시 이름", type: "string", description: "비우면 자료실 문서명 사용" },
                  { name: "doc", title: "자료실 문서 (PDF로 바로 연결)", type: "reference", to: [{ type: "doc" }] },
                  { name: "href", title: "또는 직접 링크(URL)", type: "string", description: "자료실 문서 대신 외부/직접 링크" },
                ],
                preview: { select: { title: "label", subtitle: "doc.name" } },
              }],
            },
          ],
          preview: {
            select: { title: "code", media: "image", visible: "visible" },
            prepare: ({ title, media, visible }) => ({
              title: visible === false ? `${title} (숨김)` : title,
              media,
            }),
          },
        },
      ],
    }),
    defineField({ name: "order", title: "정렬 순서(작을수록 먼저)", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "정렬 순서", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "brand" } },
});
