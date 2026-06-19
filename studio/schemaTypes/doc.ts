import { defineType, defineField } from "sanity";

export default defineType({
  name: "doc",
  title: "자료실(MSDS·시험성적서)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "자료명", type: "string", validation: (r) => r.required() }),
    defineField({ name: "category", title: "분류", type: "string", description: "예: 이형제 / 프란자오일 / 시험성적서" }),
    defineField({ name: "date", title: "등록일", type: "string", description: "예: 2026.05" }),
    defineField({
      name: "file",
      title: "PDF 파일",
      type: "file",
      options: { accept: "application/pdf" },
      description: "PDF를 올리면 사이트에 다운로드 버튼이 생깁니다(없으면 '준비중').",
    }),
  ],
  preview: { select: { title: "name", subtitle: "category" } },
});
