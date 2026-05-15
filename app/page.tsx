import Link from 'next/link';
import { ArrowLeft, HeartHandshake, Leaf, Users } from 'lucide-react';
import VolunteerCard from '@/components/VolunteerCard';
import { getFeaturedVolunteers } from '@/lib/supabase';

export default async function HomePage() {
  const volunteers = await getFeaturedVolunteers();
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">فريق تطوعي بيئي ومجتمعي</span>
            <h1>أبناء لأرض</h1>
            <p className="lead">نعمل من أجل حماية البيئة وتنمية المجتمع عبر مبادرات تطوعية، حملات توعية، وأنشطة ميدانية يقودها شباب وشابات يؤمنون بالعطاء.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
              <Link className="btn" href="/volunteers">تعرف على المتطوعين <ArrowLeft size={18}/></Link>
              <a className="btn secondary" href="#about">عن الفريق</a>
            </div>
          </div>
          <div className="hero-card">
            <h2 style={{ color: '#fff' }}>رسالتنا</h2>
            <p className="lead" style={{ fontSize: 17 }}>بناء مجتمع واعٍ يحافظ على أرضه وموارده، ويمنح المتطوعين مساحة حقيقية لإظهار أعمالهم وإنجازاتهم.</p>
          </div>
        </div>
      </section>

      <section className="container stats" aria-label="إحصائيات الفريق">
        <div className="stat"><Users /><strong>+50</strong><span>متطوع</span></div>
        <div className="stat"><Leaf /><strong>+25</strong><span>مبادرة</span></div>
        <div className="stat"><HeartHandshake /><strong>+10</strong><span>شركاء</span></div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <div className="section-head">
            <div><h2>عن الفريق</h2><p className="muted">فريق أبناء لأرض هو فريق تطوعي يركز على المشاريع البيئية، التوعية المجتمعية، وتمكين المتطوعين من مشاركة تجاربهم وإنجازاتهم.</p></div>
          </div>
          <div className="grid">
            <div className="card"><h3>حماية البيئة</h3><p className="muted">حملات تنظيف، تشجير، وفرز نفايات بالتعاون مع المجتمع المحلي.</p></div>
            <div className="card"><h3>تنمية المجتمع</h3><p className="muted">ورشات ومبادرات تقوي روح الانتماء والعمل الجماعي.</p></div>
            <div className="card"><h3>توثيق الإنجاز</h3><p className="muted">لكل متطوع صفحة خاصة تعرض سيرته وأعماله وشهاداته.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-head">
            <div><h2>متطوعون بارزون</h2><p className="muted">نماذج من أعضاء الفريق ويمكن تعديلها من Supabase.</p></div>
            <Link className="btn secondary" href="/volunteers">عرض الجميع</Link>
          </div>
          <div className="grid">{volunteers.map((v) => <VolunteerCard key={v.slug} volunteer={v} />)}</div>
        </div>
      </section>
    </main>
  );
}
