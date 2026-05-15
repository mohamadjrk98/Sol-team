import Link from 'next/link';
import { Leaf, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark"><Leaf size={25} /></span>
          <span>أبناء لأرض</span>
        </Link>
        <nav className="links">
          <Link href="/">الرئيسية</Link>
          <Link href="/volunteers">المتطوعون</Link>
          <Link href="/#about">عن الفريق</Link>
          <Link href="/admin">الإدارة</Link>
        </nav>
        <a className="btn" href="mailto:info@example.com"><UserPlus size={18}/> انضم إلينا</a>
      </div>
    </header>
  );
}
