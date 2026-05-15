'use client';
import { FormEvent, useState } from 'react';

export default function AdminPage() {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus(''); setError('');
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    const res = await fetch('/api/admin/volunteers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) return setError(json.error || 'حدث خطأ غير متوقع');
    setStatus('تم حفظ المتطوع بنجاح. يمكنك مشاهدة الصفحة عبر /volunteers/' + json.slug);
    e.currentTarget.reset();
  }
  return <main className="section"><div className="container" style={{ maxWidth: 860 }}><h2>لوحة إضافة متطوع</h2><p className="muted">هذه لوحة بسيطة محمية بكلمة مرور ADMIN_PASSWORD من Vercel. أدخل القوائم مفصولة بفواصل.</p>{status && <p className="success">{status}</p>}{error && <p className="error">{error}</p>}<form className="card admin-form" onSubmit={submit}>
    <label className="label">كلمة مرور الإدارة<input className="input" name="password" type="password" required /></label>
    <label className="label">الاسم الكامل<input className="input" name="full_name" required /></label>
    <label className="label">الرابط المختصر slug<input className="input" name="slug" placeholder="ahmad-mahmoud" required /></label>
    <label className="label">الدور<input className="input" name="role" placeholder="رئيس مجلس الإدارة / منسق فريق الرصد / متطوع" /></label>
    <label className="label">المستوى التنظيمي<select className="input" name="hierarchy_level"><option value="volunteer">متطوع</option><option value="coordinator">منسق</option><option value="board">إدارة</option></select></label>
    <label className="label">القسم<select className="input" name="department"><option>المتطوعون</option><option>المنسقون</option><option>الإدارة</option></select></label>
    <label className="label">الفريق<select className="input" name="team_name"><option value="">بدون</option><option>فريق الرصد</option><option>الفريق الميداني</option><option>الفريق الإعلامي</option><option>فريق التوعية</option></select></label>
    <label className="label">ترتيب الظهور<input className="input" name="position_rank" type="number" placeholder="1 للإدارة، 10 للمنسقين، 30 للمتطوعين" /></label>
    <label className="label">التخصص<input className="input" name="specialization" /></label>
    <label className="label">سنة الانضمام<input className="input" name="joined_year" type="number" /></label>
    <label className="label">الموقع<input className="input" name="location" /></label>
    <label className="label">العمر<input className="input" name="age" type="number" /></label>
    <label className="label">رابط الصورة<input className="input" name="avatar_url" /></label>
    <label className="label">نبذة<textarea className="textarea" name="bio" /></label>
    <label className="label">لماذا يتطوع؟<textarea className="textarea" name="motivation" /></label>
    <label className="label">المهارات<input className="input" name="skills" placeholder="إدارة المشاريع، التصوير، التواصل" /></label>
    <label className="label">الإنجازات<textarea className="textarea" name="achievements" placeholder="كل إنجاز مفصول بفاصلة" /></label>
    <label className="label">الأعمال والمشاريع<textarea className="textarea" name="works" placeholder="كل عمل مفصول بفاصلة" /></label>
    <label className="label">الشهادات<input className="input" name="certificates" /></label>
    <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 800 }}><input type="checkbox" name="is_featured" value="true" /> متطوع بارز</label>
    <button className="btn" type="submit">حفظ المتطوع</button>
  </form></div></main>;
}
