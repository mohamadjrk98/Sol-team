import Image from 'next/image';
import Link from 'next/link';
import { getInitiatives } from '@/lib/supabase';

export default async function ProjectsPage() {
  const projects = (await getInitiatives()).filter((item) => item.status === 'in_progress' || item.status === 'planned');

  return (
    <main>
      <section className="hero" style={{ padding: '70px 0' }}>
        <div className="container">
          <span className="eyebrow">الأعمال الحالية</span>
          <h1>مشاريع قيد التنفيذ</h1>
          <p className="lead">متابعة الأعمال التي يعمل عليها فريق أبناء الأرض حالياً والخطوات القادمة لكل مشروع.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid">
          {projects.map((item) => (
            <article className="card post-card" key={item.slug}>
              <div className="post-image"><Image src={item.image_url} alt={item.title} width={640} height={360}/></div>
              <div className="post-content">
                <span className={`pill status-${item.status}`}>{item.status === 'in_progress' ? 'قيد التنفيذ' : 'مخطط'}</span>
                <h3>{item.title}</h3>
                <p className="muted">{item.excerpt}</p>
                <Link className="btn secondary" href={`/blog/${item.slug}`}>تفاصيل المشروع</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
