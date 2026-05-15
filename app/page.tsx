import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BarChart3, CalendarDays, HeartHandshake, Leaf, Network, Newspaper, Users } from 'lucide-react';
import VolunteerCard from '@/components/VolunteerCard';
import { getFeaturedVolunteers, getInitiatives } from '@/lib/supabase';
import { fieldTeams, organization, teamDepartments } from '@/lib/sample-data';

export default async function HomePage() {
  const volunteers = await getFeaturedVolunteers();
  const latest = (await getInitiatives()).slice(0, 3);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">تأسس بتاريخ {organization.foundedAt}</span>
            <h1>{organization.name}</h1>
            <p className="slogan">{organization.slogan}</p>
            <p className="lead">{organization.description}</p>
            <div className="hero-actions">
              <Link className="btn yellow" href="/join">انضم إلينا <ArrowLeft size={18}/></Link>
              <Link className="btn secondary" href="/blog">شاهد أعمالنا</Link>
              <Link className="btn secondary" href="/impact">إحصائيات الأثر</Link>
            </div>
          </div>
          <div className="team-photo">
            <Image src="/team-banner.jpg" alt="صورة جماعية لفريق أبناء الأرض التطوعي" width={760} height={520} priority />
          </div>
        </div>
      </section>

      <div className="banner-strip">
        <div className="container">
          <span>هوية الفريق: عطاء، تنظيم، أثر مستدام</span>
          <span>{organization.location} • {organization.phone} • @{organization.instagram}</span>
        </div>
      </div>

      <section className="container stats" aria-label="إحصائيات الفريق">
        <div className="stat"><CalendarDays /><strong>{organization.foundedAt}</strong><span>تاريخ التأسيس</span></div>
        <div className="stat"><Network /><strong>4</strong><span>فرق اختصاصية</span></div>
        <div className="stat"><Users /><strong>27</strong><span>متطوع/ة</span></div>
        <div className="stat"><HeartHandshake /><strong>6+</strong><span>مبادرات موثقة</span></div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <div className="section-head">
            <div><h2>عن الفريق</h2><p className="muted">فريق أبناء الأرض التطوعي يعمل ضمن هيكل تنظيمي واضح يربط الإدارة بالمنسقين والمتطوعين لضمان جودة العمل واستمرارية الأثر.</p></div>
          </div>
          <div className="grid">
            <div className="card feature-card"><h3>تنمية وخدمة مجتمعية</h3><p className="muted">مبادرات وخدمات اجتماعية وتنموية تهدف إلى تحسين جودة الحياة وتعزيز التعاون.</p></div>
            <div className="card feature-card"><h3>تنظيم ووضوح مهام</h3><p className="muted">توزيع أدوار واضح بين الإدارة والمنسقين والمتطوعين والفرق المختصة.</p></div>
            <div className="card feature-card"><h3>توثيق الأثر</h3><p className="muted">لكل متطوع صفحة تعرض سيرته وأعماله وإنجازاته داخل الفريق.</p></div>
          </div>
        </div>
      </section>

      <section id="structure" className="section section-warm">
        <div className="container">
          <div className="section-head"><div><h2>الهيكل التنظيمي</h2><p className="muted">تراتبية واضحة تساعد الزائر على فهم الأدوار داخل الفريق.</p></div></div>
          <div className="grid">{teamDepartments.map((d) => <div className="card structure-card" key={d.title}><h3>{d.title}</h3><p className="muted">{d.description}</p><div className="pill-row">{d.roles.map((r) => <span className="pill" key={r}>{r}</span>)}</div></div>)}</div>
        </div>
      </section>

      <section id="teams" className="section">
        <div className="container">
          <div className="section-head"><div><h2>فرق العمل</h2><p className="muted">لكل فريق منسق خاص ومهام محددة ضمن خطة العمل.</p></div></div>
          <div className="grid">{fieldTeams.map((t) => <div className="card team-card" key={t.name}><Leaf /><h3>{t.name}</h3><p className="muted">{t.text}</p></div>)}</div>
        </div>
      </section>

      <section className="section section-warm">
        <div className="container">
          <div className="section-head">
            <div><h2>آخر أعمال الفريق</h2><p className="muted">مدونة مصغرة تعرض الأعمال المنجزة والأعمال الحالية قيد التنفيذ.</p></div>
            <Link className="btn secondary" href="/blog"><Newspaper size={18}/> كل الأعمال</Link>
          </div>
          <div className="grid">{latest.map((item) => <article className="card post-card" key={item.slug}><div className="post-image"><Image src={item.image_url} alt={item.title} width={520} height={320}/></div><div className="post-content"><span className={`pill status-${item.status}`}>{item.status === 'completed' ? 'منجز' : item.status === 'in_progress' ? 'قيد التنفيذ' : 'مخطط'}</span><h3>{item.title}</h3><p className="muted">{item.excerpt}</p><Link className="btn secondary" href={`/blog/${item.slug}`}>قراءة التفاصيل</Link></div></article>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><h2>إحصائيات وتأثير</h2><p className="muted">صفحة مخصصة تعرض تأثير الفريق بالأرقام والرسوم البيانية.</p></div>
            <Link className="btn" href="/impact"><BarChart3 size={18}/> عرض الإحصائيات</Link>
          </div>
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
