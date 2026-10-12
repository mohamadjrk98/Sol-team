import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import SolMobileNav from '@/components/SolMobileNav';
import Footer from '@/components/Footer';
import SolQuoteGift from '@/components/SolQuoteGift';
import PWARegister from '@/components/PWARegister';
import FloatingSidePanel from '@/components/FloatingSidePanel';
import { getSiteSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: { default: 'فريق أبناء الأرض التطوعي', template: '%s | أبناء الأرض' },
  description: 'منصة فريق أبناء الأرض التطوعي للتعريف بالمبادرات والمتطوعين والأثر المجتمعي واستقبال طلبات الانضمام.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'أبناء الأرض', statusBarStyle: 'black-translucent' },
  openGraph: { title: 'فريق أبناء الأرض التطوعي', description: 'أمل ينمو و أثر يبقى', images: ['/team-banner.jpg'] }
};
export const viewport: Viewport = { themeColor: '#0b4f3a', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return <html lang="ar" dir="rtl"><body><PWARegister/><Header shortName={settings.short_name}/>{children}<Footer settings={settings}/><SolQuoteGift/><SolMobileNav/></body></html>;
}
