import type { Metadata } from "next";
import "./pretendard.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sukyeonmro.co.kr"),
  title: {
    default: "석연MRO | 다이캐스팅 이형제·프란자오일 전문 제조",
    template: "%s | 석연MRO",
  },
  description:
    "다이캐스팅 현장에 필요한 이형제·프란자오일·작동유·습동면유·소모성 부자재를 직접 생산·판매하는 석연MRO. 1996년부터 이어온 다이캐스팅 국산화 기술.",
  keywords: [
    "다이캐스팅",
    "이형제",
    "프란자오일",
    "작동유",
    "습동면유",
    "CAST ONE",
    "LUBE ONE",
    "석연MRO",
  ],
  openGraph: {
    type: "website",
    title: "석연MRO | 다이캐스팅 이형제·프란자오일 전문 제조",
    description:
      "다이캐스팅 현장에 필요한 이형제·프란자오일·작동유·습동면유·소모성 부자재를 직접 생산·판매합니다.",
    url: "https://www.sukyeonmro.co.kr",
    siteName: "석연MRO",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
