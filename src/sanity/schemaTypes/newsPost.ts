import { defineType, defineField } from "sanity";

export default defineType({
  name: "newsPost",
  title: "공지사항",
  type: "document",
  fields: [
    defineField({ name: "title", title: "제목", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "슬러그(URL 주소)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "‘Generate’ 버튼으로 제목에서 자동 생성됩니다.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "분류",
      type: "string",
      options: { list: ["자료", "제품", "인증", "일반"], layout: "radio" },
      initialValue: "일반",
    }),
    defineField({ name: "date", title: "날짜", type: "string", description: "예: 2026.05.20" }),
    defineField({ name: "accent", title: "강조(파란 뱃지로 표시)", type: "boolean", initialValue: false }),
    defineField({
      name: "summary",
      title: "요약",
      type: "text",
      rows: 2,
      description: "목록·상단에 노출되는 한 줄 요약(비우면 본문 첫 문단 사용).",
    }),
    defineField({
      name: "body",
      title: "본문",
      type: "array",
      of: [{ type: "string" }],
      description: "문단 단위로 추가하세요.",
    }),
  ],
  orderings: [{ title: "날짜 내림차순", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date" } },
});
