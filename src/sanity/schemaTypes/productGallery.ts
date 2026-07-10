import { defineType, defineField } from "sanity";

export default defineType({
  name: "productGallery",
  title: "제품 갤러리 (사출 · 스프레이 · 용탕)",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "구분 키",
      type: "string",
      description: "machine-parts / spray / crucible (변경 금지)",
      options: { list: [
        { title: "사출 부품 (machine-parts)", value: "machine-parts" },
        { title: "스프레이 부품 (spray)", value: "spray" },
        { title: "용탕 관리제품 (crucible)", value: "crucible" },
      ] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "eyebrow", title: "영문 라벨", type: "string", description: "예: INJECTION PARTS" }),
    defineField({ name: "title", title: "제목", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "소개 문단", type: "text", rows: 3, description: "줄바꿈이 그대로 반영됩니다" }),
    defineField({
      name: "items",
      title: "품목 목록",
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
            { name: "image", title: "이미지", type: "image", options: { hotspot: true } },
            { name: "title", title: "품목명", type: "string", validation: (r) => r.required() },
            { name: "summary", title: "설명", type: "string" },
          ],
          preview: {
            select: { title: "title", subtitle: "summary", media: "image", visible: "visible" },
            prepare: ({ title, subtitle, media, visible }) => ({
              title: visible === false ? `${title} (숨김)` : title,
              subtitle,
              media,
            }),
          },
        },
      ],
    }),
    defineField({ name: "order", title: "정렬 순서(작을수록 먼저)", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "정렬 순서", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "key" } },
});
