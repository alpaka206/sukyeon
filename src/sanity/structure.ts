import type { StructureResolver } from "sanity/structure";

// 하나만 존재하는 싱글톤 문서
export const SINGLETONS = ["homePage", "aboutPage", "siteSettings"];

export const structure: StructureResolver = (S) =>
  S.list()
    .id("content")
    .title("콘텐츠")
    .items([
      // 페이지 (싱글톤)
      S.listItem()
        .id("homePage")
        .title("홈 화면")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .id("aboutPage")
        .title("회사소개")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),

      S.divider(),

      // 제품소개
      S.listItem()
        .id("productLineup")
        .title("제품 라인업 (이형제·프란자)")
        .schemaType("productLineup")
        .child(S.documentTypeList("productLineup").title("제품 라인업")),
      S.listItem()
        .id("productGallery")
        .title("제품 갤러리 (사출·스프레이·용탕)")
        .schemaType("productGallery")
        .child(S.documentTypeList("productGallery").title("제품 갤러리")),

      S.divider(),

      // 고객지원
      S.listItem()
        .id("newsPost")
        .title("공지사항")
        .schemaType("newsPost")
        .child(S.documentTypeList("newsPost").title("공지사항")),
      S.listItem()
        .id("doc")
        .title("자료실 문서 (PDF)")
        .schemaType("doc")
        .child(S.documentTypeList("doc").title("자료실 문서")),
      S.listItem()
        .id("catalog")
        .title("카탈로그")
        .schemaType("catalog")
        .child(S.documentTypeList("catalog").title("카탈로그")),
      S.listItem()
        .id("cert")
        .title("인증·특허")
        .schemaType("cert")
        .child(S.documentTypeList("cert").title("인증·특허")),

      S.divider(),

      // 사이트 설정 (싱글톤)
      S.listItem()
        .id("siteSettings")
        .title("사이트 설정")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
