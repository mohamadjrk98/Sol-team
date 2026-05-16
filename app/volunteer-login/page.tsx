'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock3, LockKeyhole, LogIn, UserPlus } from 'lucide-react';

export default function VolunteerLoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMessage(''); setError('');
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/volunteer-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: mode, ...Object.fromEntries(form.entries()) })
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error || 'تعذر تنفيذ العملية.');
    localStorage.setItem('abnaa_volunteer_account', JSON.stringify(json.account));
    setMessage(json.message || 'تمت العملية بنجاح.');
    if (json.account?.status === 'approved') window.location.href = '/volunteer-portal';
  }

  return (
    <main>
      <section className="hero volunteer-login-hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">بوابة المتطوعين</span>
            <h1>دخول المتطوعين</h1>
            <p className="lead">أنشئ حسابك وانتظر موافقة الإدارة، وبعد التأكيد يمكنك الدخول إلى بوابة المتطوعين ومتابعة مواعيد الفريق والتحديثات.</p>
          </div>
          <div className="hero-card login-status-card">
            <Clock3 size={44}/>
            <h2>الحسابات تحتاج موافقة</h2>
            <p className="muted" style={{color:'rgba(255,255,255,.86)'}}>أي حساب جديد يبقى بحالة انتظار حتى توافق عليه الإدارة من لوحة التحكم.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container volunteer-auth-layout">
          <div className="card volunteer-auth-card">
            <div className="auth-tabs">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}><LogIn size={18}/> تسجيل الدخول</button>
              <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}><UserPlus size={18}/> إنشاء حساب</button>
            </div>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form className="admin-form" onSubmit={submit}>
              {mode === 'signup' && <>
                <label className="label">الاسم الكامل<input className="input" name="full_name" required placeholder="اكتب اسمك الكامل" /></label>
                <label className="label">رقم الهاتف<input className="input" name="phone" placeholder="09xxxxxxxx" /></label>
                <label className="label">رابط/رمز المتطوع اختياري<input className="input" name="volunteer_slug" placeholder="مثلاً ahmad-mahmoud" /></label>
              </>}
              <label className="label">البريد الإلكتروني<input className="input" name="email" type="email" required placeholder="name@example.com" /></label>
              <label className="label">كلمة المرور<input className="input" name="password" type="password" minLength={6} required placeholder="6 أحرف على الأقل" /></label>
              <button className="btn" disabled={loading}>{loading ? 'جارٍ المعالجة...' : mode === 'login' ? 'دخول' : 'إنشاء حساب بانتظار الموافقة'}</button>
            </form>
          </div>

          <aside className="card auth-info-card">
            <LockKeyhole size={42}/>
            <h3>كيف يعمل النظام؟</h3>
            <ul className="list">
              <li><CheckCircle2 size={18}/> المتطوع ينشئ حساباً جديداً.</li>
              <li><Clock3 size={18}/> الحساب يبقى بانتظار موافقة الإدارة.</li>
              <li><CheckCircle2 size={18}/> بعد الموافقة يستطيع المتطوع الدخول إلى البوابة.</li>
            </ul>
            <Link className="btn secondary" href="/join">لست متطوعاً بعد؟ أرسل طلب انضمام</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
