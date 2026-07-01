// 석연MRO 사이트 공통 데이터

export const company = {
  name: "석연MRO",
  nameEn: "SUKYEON MRO",
  ceo: "정원재",
  address: "인천광역시 서구 염곡로 15번길 16",
  tel: "032-575-2492",
  fax: "032-575-2493",
  email: "sukyeonmro@naver.com",
  bizNo: "137-11-73397",
  hours: "평일 09:00 – 18:00 (점심 12:00 – 13:00)",
  since: "1996",
  blog: "http://blog.naver.com/sukyuen2492",
} as const;

export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

// 메인 GNB
export const nav: NavItem[] = [
  { label: "회사소개", href: "/about" },
  { label: "제품안내", href: "/products" },
  { label: "자료실", href: "/data" },
  { label: "인증·특허", href: "/cert" },
  {
    label: "고객지원",
    href: "/news",
    children: [
      { label: "공지사항", href: "/news" },
      { label: "온라인 견적·문의", href: "/contact" },
    ],
  },
];

// 푸터 링크 컬럼
export const footerColumns = [
  {
    title: "회사",
    links: [
      { label: "인사말", href: "/about#sec-greeting" },
      { label: "회사소개", href: "/about" },
      { label: "설비현황", href: "/about#sec-equipment" },
      { label: "인증·특허", href: "/cert" },
    ],
  },
  {
    title: "제품",
    links: [
      { label: "이형제", href: "/products#p-release" },
      { label: "프란자오일", href: "/products#p-pranza" },
      { label: "기타 부자재", href: "/products#p-etc-parts" },
      { label: "스프레이/사출제품", href: "/products#p-spray" },
    ],
  },
  {
    title: "고객지원",
    links: [
      { label: "자료실(MSDS)", href: "/data" },
      { label: "공지사항", href: "/news" },
      { label: "온라인 견적", href: "/contact" },
    ],
  },
];
