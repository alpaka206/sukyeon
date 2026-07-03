import { defineType, defineField } from "sanity";

const link = (of = "링크") => [
  { name: "label", title: "텍스트", type: "string" },
  { name: "href", title: of, type: "string" },
];

export default defineType({
  name: "siteSettings",
  title: "사이트 설정 (회사정보·메뉴·푸터)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "관리용 이름", type: "string", initialValue: "사이트 설정", readOnly: true, hidden: true }),
    defineField({ name: "logo", title: "로고 (헤더)", type: "image" }),
    defineField({
      name: "company",
      title: "회사 정보",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: "name", title: "상호", type: "string" },
        { name: "nameEn", title: "영문 상호", type: "string" },
        { name: "ceo", title: "대표", type: "string" },
        { name: "address", title: "주소", type: "string" },
        { name: "tel", title: "전화", type: "string" },
        { name: "fax", title: "팩스", type: "string" },
        { name: "email", title: "이메일", type: "string" },
        { name: "bizNo", title: "사업자등록번호", type: "string" },
        { name: "hours", title: "영업시간", type: "string" },
        { name: "blog", title: "블로그 URL", type: "string" },
      ],
    }),
    defineField({
      name: "nav",
      title: "상단 메뉴",
      type: "array",
      of: [{
        type: "object",
        fields: [
          ...link("링크"),
          {
            name: "children", title: "하위 메뉴", type: "array",
            of: [{ type: "object", fields: link("링크"), preview: { select: { title: "label", subtitle: "href" } } }],
          },
        ],
        preview: { select: { title: "label", subtitle: "href" } },
      }],
    }),
    defineField({ name: "footerTagline", title: "푸터 소개 문구", type: "string" }),
    defineField({
      name: "footerColumns",
      title: "푸터 링크 컬럼",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", title: "컬럼 제목", type: "string" },
          {
            name: "links", title: "링크", type: "array",
            of: [{ type: "object", fields: link("링크"), preview: { select: { title: "label", subtitle: "href" } } }],
          },
        ],
        preview: { select: { title: "title" } },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: "사이트 설정" }) },
});
