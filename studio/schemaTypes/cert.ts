import { defineType, defineField } from "sanity";

export default defineType({
  name: "cert",
  title: "인증·특허",
  type: "document",
  fields: [
    defineField({ name: "title", title: "인증명", type: "string", validation: (r) => r.required() }),
    defineField({ name: "eyebrow", title: "영문 라벨", type: "string", description: "예: QUALITY / ENVIRONMENT" }),
    defineField({ name: "standard", title: "표준규격", type: "string" }),
    defineField({ name: "desc", title: "설명", type: "text", rows: 3 }),
    defineField({ name: "issuer", title: "인증기관", type: "string" }),
    defineField({ name: "number", title: "인증번호", type: "string" }),
    defineField({ name: "scope", title: "인증범위", type: "string" }),
    defineField({ name: "validity", title: "유효기간", type: "string" }),
    defineField({ name: "imageKo", title: "국문 인증서 이미지", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageEn", title: "영문 인증서 이미지", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "정렬 순서(작을수록 먼저)", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "정렬 순서", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "standard" } },
});
