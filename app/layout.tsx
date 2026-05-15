import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'فريق أبناء لأرض',
  description: 'موقع فريق أبناء لأرض وقسم المتطوعين والسير الذاتية والإنجازات.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body><Header />{children}<Footer /></body></html>;
}
