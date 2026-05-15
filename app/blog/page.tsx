import Image from 'next/image';
import Link from 'next/link';
import { getInitiatives } from '@/lib/supabase';

function statusLabel(status: string) {
  if (status === 'completed') return 'منجز';
  if (status === 'in_progress') return 'قيد التنفيذ';
  return 'مخطط';
}

export default async function BlogPage() {
  const posts = await getInitiatives();

  return (
    <main>
      <section className="hero" style={{ padding: '70px 0' }}>
        <div className="container">
          <span className="eyebrow">مدونة وأعمال الفريق</span>
          <h1>أعمال أبناء الأرض</h1>
          <p className="lead">توثيق المبادرات والأنشطة والإنجازات الحالية والمنجزة بطريقة منظمة تعكس أثر الفريق.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid">
          {posts.map((item) => (
            <article className="card post-card" key={item.slug}>
              <div className="post-image"><Image src={item.image_url} alt={item.title} width={640} height={360}/></div>
              <div className="post-content">
                <div className="meta">
                  <span className={`pill status-${item.status}`}>{statusLabel(item.status)}</span>
                  <span className="pill">{item.category}</span>
                  <span className="pill yellow">{item.team}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="muted">{item.excerpt}</p>
                <Link className="btn secondary" href={`/blog/${item.slug}`}>قراءة التفاصيل</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
