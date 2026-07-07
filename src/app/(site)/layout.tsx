import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";

// ISR: Sanity(CMS) 편집 내용이 재배포 없이 최대 60초 내 반영되도록 (site) 전 페이지에 적용.
// 라우트의 재검증 주기는 레이아웃·페이지 중 가장 낮은 값 → 여기서 지정하면 하위 전 페이지에 전파됨.
export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
