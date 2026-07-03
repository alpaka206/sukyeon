import { defineType, defineField } from "sanity";

const linkFields = (labelTitle: string) => [
  { name: "label", title: labelTitle, type: "string" },
  { name: "href", title: "링크", type: "string" },
];

export default defineType({
  name: "homePage",
  title: "홈 화면",
  type: "document",
  fields: [
    defineField({ name: "title", title: "관리용 이름", type: "string", initialValue: "홈 화면", readOnly: true, hidden: true }),

    // 히어로
    defineField({
      name: "hero",
      title: "히어로 (상단)",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: "titleLine1", title: "제목 1줄 (진한 남색)", type: "string" },
        { name: "titleLine2", title: "제목 2줄 (파란색 강조)", type: "string" },
        { name: "copyLine1", title: "본문 1줄", type: "text", rows: 2 },
        { name: "copyLine2", title: "본문 2줄", type: "text", rows: 2 },
        { name: "primaryLabel", title: "주 버튼 텍스트", type: "string" },
        { name: "primaryHref", title: "주 버튼 링크", type: "string" },
        { name: "secondaryLabel", title: "보조 버튼 텍스트", type: "string" },
        { name: "secondaryHref", title: "보조 버튼 링크", type: "string" },
        {
          name: "slides",
          title: "슬라이드 이미지 (자동 넘김)",
          type: "array",
          of: [{
            type: "object",
            fields: [
              { name: "desktopImage", title: "데스크톱 이미지 (가로형)", type: "image", options: { hotspot: true } },
              { name: "mobileImage", title: "모바일 이미지 (세로/정사각)", type: "image", options: { hotspot: true } },
              { name: "alt", title: "대체 텍스트", type: "string" },
            ],
            preview: { select: { title: "alt", media: "desktopImage" } },
          }],
        },
      ],
    }),

    // 제품 미리보기
    defineField({
      name: "productsHeading",
      title: "제품소개 섹션 제목",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "eyebrow", title: "영문 라벨", type: "string" },
        { name: "title", title: "제목", type: "string" },
        { name: "moreLabel", title: "더보기 텍스트", type: "string" },
        { name: "moreHref", title: "더보기 링크", type: "string" },
      ],
    }),
    defineField({
      name: "productCards",
      title: "제품 미리보기 카드",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "image", title: "이미지", type: "image", options: { hotspot: true } },
          { name: "title", title: "제목", type: "string" },
          { name: "tag", title: "태그 (예: CAST ONE)", type: "string" },
          { name: "desc", title: "설명", type: "text", rows: 2 },
          { name: "href", title: "링크", type: "string" },
        ],
        preview: { select: { title: "title", subtitle: "tag", media: "image" } },
      }],
    }),
    defineField({
      name: "productsCta",
      title: "제품 섹션 CTA 카드",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "title", title: "제목 (줄바꿈 반영)", type: "text", rows: 2 },
        { name: "desc", title: "설명", type: "string" },
        ...linkFields("버튼 텍스트"),
      ],
    }),

    // 현장이 신뢰하는 이유
    defineField({
      name: "whyHeading",
      title: "‘현장이 신뢰하는 이유’ 제목",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "eyebrow", title: "영문 라벨", type: "string" },
        { name: "title", title: "제목", type: "string" },
      ],
    }),
    defineField({
      name: "whyItems",
      title: "‘현장이 신뢰하는 이유’ 항목",
      type: "array",
      of: [{
        type: "object",
        fields: [
          {
            name: "icon", title: "아이콘", type: "string",
            options: { list: [
              { title: "제조/기술", value: "manufacturing" },
              { title: "품질", value: "quality" },
              { title: "납품/배송", value: "delivery" },
              { title: "기술지원", value: "support" },
            ] },
          },
          { name: "title", title: "제목", type: "string" },
          { name: "desc", title: "설명", type: "text", rows: 2 },
        ],
        preview: { select: { title: "title", subtitle: "icon" } },
      }],
    }),

    // 하단 문의 CTA
    defineField({
      name: "contactCta",
      title: "하단 문의 CTA",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "title", title: "제목 (줄바꿈 반영)", type: "text", rows: 2 },
        { name: "desc", title: "설명", type: "string" },
        { name: "primaryLabel", title: "주 버튼 텍스트", type: "string" },
        { name: "primaryHref", title: "주 버튼 링크", type: "string" },
        { name: "phoneLabel", title: "전화 버튼 텍스트", type: "string" },
        { name: "phoneHref", title: "전화 링크 (tel:)", type: "string" },
      ],
    }),
  ],
  preview: { select: { title: "title" }, prepare: () => ({ title: "홈 화면" }) },
});
