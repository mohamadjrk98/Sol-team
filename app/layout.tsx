import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PWARegister from '@/components/PWARegister';

export const metadata: Metadata = {
  title: 'فريق أبناء الأرض التطوعي',
  description: 'منصة فريق أبناء الأرض التطوعي لإدارة المتطوعين والمبادرات والأثر المجتمعي.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'أبناء الأرض', statusBarStyle: 'black-translucent' },
  openGraph: {
    title: 'فريق أبناء الأرض التطوعي',
    description: 'أمل ينمو و أثر يبقى',
    images: ['/team-banner.jpg']
  }
};

export const viewport: Viewport = { themeColor: '#0b4f3a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body><PWARegister /><Header />{children}<Footer /></body></html>;
}
