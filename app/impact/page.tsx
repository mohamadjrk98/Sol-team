import { BarChart3, HeartHandshake, Users } from 'lucide-react';
import { getImpactMetrics, getInitiatives } from '@/lib/supabase';

export default async function ImpactPage() {
  const metrics = await getImpactMetrics();
  const initiatives = await getInitiatives();
  const max = Math.max(...metrics.map((m) => m.value), 1);

  return (
    <main>
      <section className="hero" style={{ padding: '70px 0' }}>
        <div className="container">
          <span className="eyebrow">تأثير الفريق بالأرقام</span>
          <h1>إحصائيات ومؤشرات الأثر</h1>
          <p className="lead">لوحة تعرض أثر المبادرات والمتطوعين بشكل مبسط وقابل للتحديث من Supabase لاحقاً.</p>
        </div>
      </section>
      <section className="section">
        <div className="container impact-grid">
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            {metrics.map((m) => (
              <div className="card" key={m.label}>
                <div className="metric-number">{m.value}{m.suffix ?? ''}</div>
                <h3>{m.label}</h3>
                <p className="muted">{m.description}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <BarChart3 className="icon-badge" />
            <h2>Chart الأثر المجتمعي</h2>
            <div className="chart">
              {metrics.map((m) => (
                <div className="bar-row" key={m.label}>
                  <div className="bar-head"><span>{m.label}</span><span>{m.value}{m.suffix ?? ''}</span></div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max((m.value / max) * 100, 8)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section section-warm">
        <div className="container grid two">
          <div className="card"><Users className="icon-badge"/><h3>أثر المتطوعين</h3><p className="muted">كل متطوع له صفحة خاصة تحفظ أعماله وإنجازاته، مما يحول الجهد الفردي إلى أرشيف مؤسسي واضح.</p></div>
          <div className="card"><HeartHandshake className="icon-badge"/><h3>أثر المبادرات</h3><p className="muted">عدد المبادرات الموثقة حالياً: {initiatives.length}. يمكن إضافة المزيد لاحقاً من قاعدة البيانات.</p></div>
        </div>
      </section>
    </main>
  );
}
