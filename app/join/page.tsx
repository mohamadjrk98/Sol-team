'use client';
import { FormEvent, useState } from 'react';
import { MailCheck, Send, Users } from 'lucide-react';

export default function JoinPage() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error || 'حدث خطأ غير متوقع');
    setStatus('تم استلام طلبك بنجاح. سنراجع البيانات ونتواصل معك عند فتح ورشة أو فرصة مناسبة.');
    e.currentTarget.reset();
  }

  return (
    <main>
      <section className="hero" style={{ padding: '72px 0' }}>
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">طلبات الانضمام</span>
            <h1>ابدأ رحلتك التطوعية معنا</h1>
            <p className="lead">حالياً لا توجد ورشة تدريبية مفتوحة، لكن يمكنك إرسال طلب انضمام كامل ليصل مباشرة إلى لوحة الإدارة.</p>
          </div>
          <div className="hero-card"><Users size={44}/><h2>أمل ينمو و أثر يبقى</h2><p className="muted" style={{ color: 'rgba(255,255,255,.85)' }}>نبحث عن أشخاص يؤمنون بالأثر، الالتزام، والعمل الجماعي.</p></div>
        </div>
      </section>
      <section className="section">
        <div className="container join-layout">
          <div className="card join-card">
            <MailCheck size={46}/>
            <h2>طلب انضمام متطوع</h2>
            <p className="muted">املأ البيانات التالية، وسيتم حفظ الطلب في لوحة التحكم ليتم التواصل معك لاحقاً.</p>
            {status && <p className="success">{status}</p>}
            {error && <p className="error">{error}</p>}
            <form className="admin-form" onSubmit={submit}>
              <div className="form-grid two">
                <label className="label">الاسم الكامل<input className="input" name="full_name" required placeholder="اكتب اسمك الكامل" /></label>
                <label className="label">البريد الإلكتروني<input className="input" name="email" type="email" required placeholder="name@example.com" /></label>
                <label className="label">رقم الهاتف<input className="input" name="phone" required placeholder="09xxxxxxxx" /></label>
                <label className="label">العمر<input className="input" name="age" type="number" min="12" max="80" placeholder="مثلاً 22" /></label>
                <label className="label">المدينة / المنطقة<input className="input" name="city" placeholder="مصياف" /></label>
                <label className="label">الاختصاص أو المهارة<input className="input" name="specialization" placeholder="إعلام، تمريض، تنظيم، تصميم..." /></label>
                <label className="label">الفريق المفضل<select className="input" name="preferred_team"><option>الفريق الميداني</option><option>الفريق الإعلامي</option><option>فريق التوعية</option><option>فريق الرصد</option><option>غير محدد</option></select></label>
                <label className="label">أوقات التفرغ<input className="input" name="availability" placeholder="مساءً، نهاية الأسبوع..." /></label>
              </div>
              <label className="label">لماذا تطوعت؟<textarea className="textarea" name="motivation" required placeholder="اكتب سبب تطوعك وانضمامك للفريق" /></label>
              <label className="label">خبرات سابقة اختيارية<textarea className="textarea" name="experience" placeholder="أي أعمال تطوعية أو مهارات سابقة" /></label>
              <button className="btn" type="submit" disabled={loading}><Send size={18}/> {loading ? 'جارٍ الإرسال...' : 'إرسال طلب الانضمام'}</button>
            </form>
          </div>
          <div className="card join-note">
            <h3>ماذا يحدث بعد الإرسال؟</h3>
            <p className="muted">سيظهر طلبك في لوحة الإدارة، ويمكن لمسؤول الموارد البشرية تغيير حالته إلى: جديد، قيد المراجعة، مقبول، مرفوض أو تم التواصل.</p>
            <div className="pill-row"><span className="pill yellow">مراجعة منظمة</span><span className="pill yellow">تواصل لاحق</span><span className="pill yellow">ورشة تدريبية</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
