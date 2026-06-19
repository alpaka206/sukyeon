import { defineType, defineField } from "sanity";

export default defineType({
  name: "newsPost",
  title: "공지사항",
  type: "document",
  fields: [
    defineField({ name: "title", title: "제목", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "분류",
      type: "string",
      options: { list: ["자료", "제품", "인증", "일반"], layout: "radio" },
      initialValue: "일반",
    }),
    defineField({ name: "date", title: "날짜", type: "string", description: "예: 2026.05.20" }),
    defineField({ name: "accent", title: "강조(파란 뱃지로 표시)", type: "boolean", initialValue: false }),
  ],
  orderings: [{ title: "날짜 내림차순", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date" } },
});
