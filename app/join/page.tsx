'use client';
import { FormEvent, useState } from 'react';
import { MailCheck } from 'lucide-react';

export default function JoinPage() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus(''); setError('');
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    const json = await res.json();
    if (!res.ok) return setError(json.error || 'حدث خطأ غير متوقع');
    setStatus('تم حفظ بريدك بنجاح. سنخبرك عند افتتاح ورشة تدريبية للمتطوعين.');
    e.currentTarget.reset();
  }
  return <main className="section"><div className="container join-layout"><div className="card join-card"><MailCheck size={46}/><h2>انضم إلينا</h2><p className="muted">حالياً لا توجد ورشة تدريبية مفتوحة للمتطوعين. اترك بريدك الإلكتروني وسنخبرك فور إقامة ورشة تدريبية جديدة.</p>{status && <p className="success">{status}</p>}{error && <p className="error">{error}</p>}<form className="admin-form" onSubmit={submit}><label className="label">الاسم الكامل<input className="input" name="full_name" placeholder="اكتب اسمك" /></label><label className="label">البريد الإلكتروني<input className="input" name="email" type="email" required placeholder="name@example.com" /></label><label className="label">رقم الهاتف اختياري<input className="input" name="phone" placeholder="09xxxxxxxx" /></label><button className="btn" type="submit">أخبروني عند فتح الورشة</button></form></div><div className="card join-note"><h3>أمل ينمو و أثر يبقى</h3><p className="muted">نؤمن أن التطوع يبدأ بخطوة، وعندما تفتح الورشة القادمة سنرسل لك التفاصيل وشروط الانضمام ومواعيد التدريب.</p></div></div></main>;
}
