import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
