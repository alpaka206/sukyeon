import { defineType, defineField } from "sanity";

export default defineType({
  name: "doc",
  title: "자료실(MSDS·시험성적서)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "자료명", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "슬러그(URL 주소)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      description: "‘Generate’ 버튼으로 자료명에서 자동 생성됩니다.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", title: "분류", type: "string", description: "예: 이형제 / 프란자오일 / 시험성적서" }),
    defineField({ name: "date", title: "등록일", type: "string", description: "예: 2026.05" }),
    defineField({
      name: "notice",
      title: "상단 고정(공지)",
      type: "boolean",
      initialValue: false,
      description: "켜면 자료실 목록 맨 위에 표시됩니다.",
    }),
    defineField({
      name: "file",
      title: "대표 PDF",
      type: "file",
      options: { accept: "application/pdf" },
      description: "PDF를 올리면 사이트에 다운로드 버튼이 생깁니다(없으면 '준비중').",
    }),
    defineField({
      name: "summary",
      title: "요약",
      type: "text",
      rows: 2,
      description: "상세 페이지 상단 요약(비우면 본문 첫 문단 사용).",
    }),
    defineField({
      name: "body",
      title: "본문",
      type: "array",
      of: [{ type: "string" }],
      description: "문단 단위로 추가하세요.",
    }),
    defineField({
      name: "attachments",
      title: "첨부 PDF(여러 개)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "파일 이름", type: "string" },
            { name: "file", title: "PDF", type: "file", options: { accept: "application/pdf" } },
          ],
          preview: { select: { title: "name" } },
        },
      ],
      description: "국문/영문 등 여러 PDF를 첨부할 수 있습니다.",
    }),
  ],
  orderings: [{ title: "등록일 내림차순", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "name", subtitle: "category" } },
});
