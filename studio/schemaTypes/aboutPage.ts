import { defineType, defineField } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "회사소개 화면",
  type: "document",
  fields: [
    defineField({ name: "title", title: "관리용 이름", type: "string", initialValue: "회사소개", readOnly: true, hidden: true }),

    defineField({
      name: "greeting",
      title: "인사말",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "heading", title: "제목 (줄바꿈 반영)", type: "text", rows: 2 },
        { name: "paragraphs", title: "본문 문단", type: "array", of: [{ type: "text", rows: 3 }] },
        { name: "signName", title: "서명 (대표명)", type: "string" },
        { name: "signLabel", title: "서명 앞 문구", type: "string" },
        { name: "image", title: "이미지 (공장 외관)", type: "image", options: { hotspot: true } },
      ],
    }),

    defineField({
      name: "info",
      title: "회사소개",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "heading", title: "제목 (줄바꿈 반영)", type: "text", rows: 2 },
        { name: "paragraphs", title: "본문 문단", type: "array", of: [{ type: "text", rows: 3 }] },
        { name: "image", title: "이미지 (생산 설비)", type: "image", options: { hotspot: true } },
        {
          name: "values", title: "핵심 가치 (3개)", type: "array",
          of: [{
            type: "object",
            fields: [
              { name: "no", title: "번호 (예: 01)", type: "string" },
              { name: "title", title: "제목", type: "string" },
              { name: "desc", title: "설명", type: "text", rows: 2 },
            ],
            preview: { select: { title: "title", subtitle: "no" } },
          }],
        },
      ],
    }),

    defineField({
      name: "equipment",
      title: "설비현황",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "desc", title: "설명", type: "text", rows: 2 },
        {
          name: "rows", title: "설비 목록", type: "array",
          of: [{
            type: "object",
            fields: [
              { name: "no", title: "구분", type: "string" },
              { name: "name", title: "설비명", type: "string" },
              { name: "cap", title: "설비용량", type: "string" },
            ],
            preview: { select: { title: "name", subtitle: "cap" } },
          }],
        },
      ],
    }),

    defineField({
      name: "history",
      title: "연혁",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "desc", title: "설명", type: "text", rows: 2 },
        {
          name: "entries", title: "연혁 항목", type: "array",
          of: [{
            type: "object",
            fields: [
              { name: "year", title: "연도", type: "string" },
              { name: "lines", title: "내용(줄별)", type: "array", of: [{ type: "string" }] },
            ],
            preview: { select: { title: "year" } },
          }],
        },
      ],
    }),

    defineField({
      name: "location",
      title: "오시는 길",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "mapNote", title: "지도 자리 안내 문구", type: "string" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "회사소개 화면" }) },
});
