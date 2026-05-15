import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInitiativeBySlug, getInitiatives } from '@/lib/supabase';

export async function generateStaticParams() {
  const posts = await getInitiatives();
  return posts.map((post) => ({ slug: post.slug }));
}

function statusLabel(status: string) {
  if (status === 'completed') return 'منجز';
  if (status === 'in_progress') return 'قيد التنفيذ';
  return 'مخطط';
}

export default async function InitiativePage({ params }: { params: { slug: string } }) {
  const item = await getInitiativeBySlug(params.slug);
  if (!item) return notFound();

  return (
    <main>
      <section className="hero" style={{ padding: '70px 0' }}>
        <div className="container">
          <span className="eyebrow">{item.category}</span>
          <h1>{item.title}</h1>
          <p className="lead">{item.excerpt}</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <div className="card">
            <Image src={item.image_url} alt={item.title} width={900} height={540} style={{ borderRadius: 22, width: '100%', height: 'auto' }} />
          </div>
          <article className="card">
            <div className="meta">
              <span className={`pill status-${item.status}`}>{statusLabel(item.status)}</span>
              <span className="pill">{item.team}</span>
              <span className="pill yellow">{item.location}</span>
            </div>
            <h2>{item.title}</h2>
            <p className="muted">{item.content}</p>
            <div className="timeline">
              <div className="timeline-item"><strong>التاريخ</strong><p className="muted">{item.date}</p></div>
              <div className="timeline-item"><strong>الفريق المسؤول</strong><p className="muted">{item.team}</p></div>
              <div className="timeline-item"><strong>الموقع</strong><p className="muted">{item.location}</p></div>
            </div>
            <Link className="btn secondary" href="/blog">العودة لكل الأعمال</Link>
          </article>
        </div>
      </section>
    </main>
  );
}
