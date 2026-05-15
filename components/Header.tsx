import Image from 'next/image';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function Header() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="logo-wrap"><Image src="/logo.png" alt="شعار فريق أبناء الأرض" width={54} height={54} /></span>
          <span>أبناء الأرض</span>
        </Link>
        <nav className="links">
          <Link href="/">الرئيسية</Link>
          <Link href="/volunteers">المتطوعون</Link>
          <Link href="/#structure">الهيكل التنظيمي</Link>
          <Link href="/#teams">الفرق</Link>
          <Link href="/admin">الإدارة</Link>
        </nav>
        <Link className="btn" href="/join"><UserPlus size={18}/> انضم إلينا</Link>
      </div>
    </header>
  );
}
