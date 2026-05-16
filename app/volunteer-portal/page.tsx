'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock3, LogOut, Star } from 'lucide-react';

type Account = { full_name:string; email:string; status:string; volunteer_slug?:string };

export default function VolunteerPortalPage() {
  const [account, setAccount] = useState<Account | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem('abnaa_volunteer_account');
    if (raw) setAccount(JSON.parse(raw));
  }, []);
  function logout(){ localStorage.removeItem('abnaa_volunteer_account'); window.location.href='/volunteer-login'; }

  if (!account) return <main className="section"><div className="container"><div className="card"><h1>بوابة المتطوعين</h1><p className="muted">يرجى تسجيل الدخول أولاً.</p><Link className="btn" href="/volunteer-login">دخول المتطوعين</Link></div></div></main>;

  const approved = account.status === 'approved';
  return (
    <main>
      <section className="admin-hero"><div className="container"><span className="eyebrow">بوابة المتطوعين</span><h1>أهلاً {account.full_name}</h1><p className="lead small">{approved ? 'حسابك مفعل ويمكنك متابعة التحديثات.' : 'حسابك بانتظار تأكيد الإدارة.'}</p></div></section>
      <section className="section"><div className="container portal-grid">
        <div className="card portal-main-card">
          {approved ? <CheckCircle2 size={52}/> : <Clock3 size={52}/>}<h2>{approved ? 'الحساب مؤكد' : 'بانتظار الموافقة'}</h2>
          <p className="muted">{approved ? 'سيتم إضافة أدوات خاصة للمتطوعين هنا: ساعات التطوع، الحضور، التنبيهات، وسجل المبادرات.' : 'عند موافقة الإدارة سيصبح بإمكانك الدخول إلى البوابة بشكل كامل.'}</p>
          <button className="btn secondary" onClick={logout}><LogOut size={18}/> تسجيل الخروج</button>
        </div>
        <aside className="card portal-side-card">
          <h3>مواعيد هامة</h3>
          <p className="important-date"><CalendarDays size={20}/> الاجتماع العام: الخميس الساعة 5</p>
          <Link className="btn yellow" href="/star-vote"><Star size={18}/> صوّت لنجم الأسبوع</Link>
          {account.volunteer_slug && <Link className="btn secondary" href={`/volunteers/${account.volunteer_slug}`}>عرض صفحتي العامة</Link>}
        </aside>
      </div></section>
    </main>
  );
}
