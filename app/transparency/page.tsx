import { BarChart3, FileCheck2, HandHeart, ShieldCheck, UsersRound } from 'lucide-react';
import { getImpactMetrics, getInitiatives, getVolunteers } from '@/lib/supabase';

export const revalidate = 60;

export default async function TransparencyPage() {
  const [metrics, initiatives, volunteers] = await Promise.all([getImpactMetrics(), getInitiatives(), getVolunteers()]);
  const active = volunteers.filter(v => (v.volunteer_status || 'active') === 'active').length;
  const completed = initiatives.filter(i => i.status === 'completed').length;
  return <main>
    <section className="inner-hero transparency-hero"><div className="container"><span className="eyebrow">الشفافية والثقة</span><h1>أثر واضح، بيانات منظمة، ومسؤولية مجتمعية</h1><p className="lead small">هذه الصفحة مخصصة لتوضيح بنية العمل التطوعي، أثر المبادرات، وآلية إدارة البيانات داخل فريق أبناء الأرض التطوعي.</p></div></section>
    <section className="section"><div className="container transparency-grid">
      <article className="card trust-card"><ShieldCheck size={34}/><h3>حوكمة الفريق</h3><p className="muted">إدارة، منسقون، وفرق عمل متخصصة لضمان وضوح المسؤوليات وجودة التنفيذ.</p></article>
      <article className="card trust-card"><UsersRound size={34}/><h3>المتطوعون النشطون</h3><strong>{active}</strong><p className="muted">يتم تحديث الحالات من لوحة الإدارة: نشط، إجازة، غادر، أو غير ذلك.</p></article>
      <article className="card trust-card"><HandHeart size={34}/><h3>المبادرات المكتملة</h3><strong>{completed}</strong><p className="muted">كل مبادرة يمكن أرشفتها مع حالتها، فريقها المسؤول، وتاريخها.</p></article>
      <article className="card trust-card"><BarChart3 size={34}/><h3>مؤشرات الأثر</h3><strong>{metrics.length}</strong><p className="muted">أرقام قابلة للتحديث توضح مدى تأثير الفريق على المجتمع.</p></article>
    </div></section>
    <section className="section alt"><div className="container grid two">
      <div className="card"><FileCheck2 size={34}/><h2>مبادئ الشفافية</h2><ul className="list"><li>توثيق المبادرات المنجزة وقيد التنفيذ.</li><li>عرض الإحصائيات بطريقة واضحة وقابلة للتحديث.</li><li>حفظ بيانات المتطوعين ضمن قاعدة منظمة.</li><li>استخدام QR للتحقق من بطاقة العضوية وصفحة المتطوع.</li></ul></div>
      <div className="card"><h2>ما الذي سيتم تطويره لاحقاً؟</h2><ul className="list"><li>تقارير PDF دورية للمبادرات.</li><li>سجل مالي مبسط للدعم والتبرعات عند توفره.</li><li>أرشيف صور وفيديو لكل مبادرة.</li><li>تتبع ساعات العمل التطوعي لكل عضو.</li></ul></div>
    </div></section>
  </main>;
}
