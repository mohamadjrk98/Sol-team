'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const router = useRouter();
  const taps = useRef<number[]>([]);

  const handleLogoTap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 5000), now];
    if (taps.current.length >= 7) {
      taps.current = [];
      router.push('/admin');
    }
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <button type="button" className="brand hidden-admin-trigger" onClick={handleLogoTap} aria-label="فريق أبناء الأرض">
          <span className="logo-wrap"><Image src="/logo.png" alt="شعار فريق أبناء الأرض" width={54} height={54} /></span>
          <span>أبناء الأرض</span>
        </button>
        <nav className="links">
          <Link href="/">الرئيسية</Link>
          <Link href="/volunteers">المتطوعون</Link>
          <Link href="/blog">الأعمال والمدونة</Link>
          <Link href="/projects">قيد التنفيذ</Link>
          <Link href="/impact">الإحصائيات</Link>
          <Link href="/transparency">الشفافية</Link>
        </nav>
        <div className="nav-actions"><ThemeToggle /><Link className="btn secondary volunteer-login-btn" href="/volunteer-login"><LogIn size={18}/> دخول المتطوعين</Link><Link className="btn" href="/join"><UserPlus size={18}/> انضم إلينا</Link></div>
      </div>
    </header>
  );
}
