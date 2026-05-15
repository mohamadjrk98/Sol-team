import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, HeartHandshake, Leaf, Network, Users } from 'lucide-react';
import VolunteerCard from '@/components/VolunteerCard';
import { getFeaturedVolunteers } from '@/lib/supabase';
import { fieldTeams, teamDepartments } from '@/lib/sample-data';

export default async function HomePage() {
  const volunteers = await getFeaturedVolunteers();
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">فريق تطوعي اجتماعي وتنموي</span>
            <h1>أبناء الأرض</h1>
            <p className="slogan">أمل ينمو و أثر يبقى</p>
            <p className="lead">فريق أبناء الأرض التطوعي يسعى للمساهمة في بناء مجتمع متماسك ومزدهر من خلال تقديم خدمات اجتماعية وتنموية تركز على تعزيز جودة الحياة.</p>
            <div className="hero-actions">
              <Link className="btn" href="/join">انضم إلينا <ArrowLeft size={18}/></Link>
              <Link className="btn secondary" href="/volunteers">تعرف على المتطوعين</Link>
            </div>
          </div>
          <div className="hero-card logo-card">
            <Image src="/logo.png" alt="شعار فريق أبناء الأرض" width={220} height={220} priority />
            <h2>رسالتنا</h2>
            <p className="lead small">تنظيم الجهود التطوعية، بناء فرق واضحة المهام، وإبراز أثر كل متطوع ضمن صفحة خاصة تحفظ أعماله وإنجازاته.</p>
          </div>
        </div>
      </section>

      <section className="container stats" aria-label="إحصائيات الفريق">
        <div className="stat"><CalendarDays /><strong>25/1/2025</strong><span>تاريخ التأسيس</span></div>
        <div className="stat"><Network /><strong>4</strong><span>فرق اختصاصية</span></div>
        <div className="stat"><Users /><strong>3</strong><span>مستويات تنظيمية</span></div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <div className="section-head">
            <div><h2>عن الفريق</h2><p className="muted">فريق أبناء الأرض التطوعي تأسس بتاريخ 25/1/2025، ويعمل ضمن هيكل تنظيمي واضح يربط الإدارة بالمنسقين والمتطوعين لضمان جودة العمل واستمرارية الأثر.</p></div>
          </div>
          <div className="grid">
            <div className="card"><h3>تنمية وخدمة مجتمعية</h3><p className="muted">مبادرات وخدمات اجتماعية وتنموية تهدف إلى تحسين جودة الحياة وتعزيز التعاون.</p></div>
            <div className="card"><h3>تنظيم ووضوح مهام</h3><p className="muted">توزيع أدوار واضح بين الإدارة والمنسقين والمتطوعين والفرق المختصة.</p></div>
            <div className="card"><h3>توثيق الأثر</h3><p className="muted">لكل متطوع صفحة تعرض سيرته وأعماله وإنجازاته داخل الفريق.</p></div>
          </div>
        </div>
      </section>

      <section id="structure" className="section section-warm">
        <div className="container">
          <div className="section-head"><div><h2>الهيكل التنظيمي</h2><p className="muted">تراتبية واضحة تساعد الزائر على فهم الأدوار داخل فريق أبناء الأرض.</p></div></div>
          <div className="grid">{teamDepartments.map((d) => <div className="card structure-card" key={d.title}><h3>{d.title}</h3><p className="muted">{d.description}</p><div className="pill-row">{d.roles.map((r) => <span className="pill" key={r}>{r}</span>)}</div></div>)}</div>
        </div>
      </section>

      <section id="teams" className="section">
        <div className="container">
          <div className="section-head"><div><h2>فرق العمل</h2><p className="muted">لكل فريق منسق خاص ومهام محددة ضمن خطة العمل.</p></div></div>
          <div className="grid">{fieldTeams.map((t) => <div className="card team-card" key={t.name}><Leaf /><h3>{t.name}</h3><p className="muted">{t.text}</p></div>)}</div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-head">
            <div><h2>متطوعون بارزون</h2><p className="muted">نماذج يمكن تعديلها من Supabase ولوحة الإدارة.</p></div>
            <Link className="btn secondary" href="/volunteers">عرض الجميع</Link>
          </div>
          <div className="grid">{volunteers.map((v) => <VolunteerCard key={v.slug} volunteer={v} />)}</div>
        </div>
      </section>
    </main>
  );
}
