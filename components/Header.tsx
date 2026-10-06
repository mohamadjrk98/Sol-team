'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Menu, UserPlus, X, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ shortName = 'أبناء الأرض' }: { shortName?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const taps = useRef<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!adminOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAdminOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [adminOpen]);

  function handleLogoTap() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 4500), now];
    if (taps.current.length >= 7) {
      taps.current = [];
      setPassword('');
      setError('');
      setAdminOpen(true);
    }
  }

  async function adminLogin(e: FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = await fetch('/api/admin/session', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password })
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setError(json.error || 'تعذر تسجيل الدخول.');
    setAdminOpen(false);
    router.push('/admin/dashboard');
    router.refresh();
  }

  const links = [
    ['/', 'الرئيسية'], ['/volunteers', 'المتطوعون'], ['/blog', 'الأعمال والمدونة'],
    ['/projects', 'قيد التنفيذ'], ['/impact', 'الإحصائيات'], ['/transparency', 'الشفافية']
  ];

  return <>
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand">
          <button type="button" className="hidden-admin-trigger" onClick={handleLogoTap} aria-label="شعار الفريق">
            <span className="logo-wrap"><Image src="/logo.png" alt="شعار الفريق" width={54} height={54} priority /></span>
          </button>
          <Link href="/">{shortName}</Link>
        </div>

        <nav className={`links ${menuOpen ? 'open' : ''}`} aria-label="التنقل الرئيسي">
          {links.map(([href, label]) => <Link key={href} className={pathname === href ? 'active' : ''} href={href}>{label}</Link>)}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <Link className="btn" href="/join"><UserPlus size={18}/> انضم إلينا</Link>
          <button className="mobile-menu-btn" type="button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={22}/> : <Menu size={22}/>} 
          </button>
        </div>
      </div>
    </header>

    {adminOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.currentTarget === e.target) setAdminOpen(false); }}>
      <section className="admin-secret-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button className="modal-close" type="button" onClick={() => setAdminOpen(false)} aria-label="إغلاق"><X size={20}/></button>
        <div className="admin-secret-icon"><ShieldCheck size={28}/></div>
        <h2 id="admin-login-title">دخول الإدارة</h2>
        <p>أدخل كلمة مرور الإدارة للانتقال إلى لوحة التحكم.</p>
        <form onSubmit={adminLogin}>
          <label className="label">كلمة المرور
            <input autoFocus className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
          </label>
          {error && <p className="error compact">{error}</p>}
          <button className="btn admin-login-submit" disabled={loading}>{loading ? 'جارٍ التحقق...' : 'دخول لوحة الإدارة'}</button>
        </form>
      </section>
    </div>}
  </>;
}
