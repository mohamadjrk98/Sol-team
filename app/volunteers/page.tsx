import VolunteerCard from '@/components/VolunteerCard';
import { getVolunteers } from '@/lib/supabase';

export const revalidate = 60;

const sectionOrder = ['الإدارة', 'المنسقون', 'المتطوعون'];

export default async function VolunteersPage() {
  const volunteers = await getVolunteers();
  const sorted = [...volunteers].sort((a, b) => (a.position_rank ?? 999) - (b.position_rank ?? 999));
  const groups = sectionOrder.map((name) => ({ name, items: sorted.filter((v) => v.department === name) }));
  const remaining = sorted.filter((v) => !v.department || !sectionOrder.includes(v.department));
  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>المتطوعون والهيكل التنظيمي</h2>
            <p className="muted">تصفح أعضاء فريق أبناء الأرض حسب الإدارة، المنسقين، والمتطوعين، مع إبراز الفريق والدور لكل عضو.</p>
          </div>
        </div>
        {volunteers.length === 0 ? <div className="empty">لا يوجد متطوعون حالياً.</div> : <div className="volunteer-groups">{groups.map((g) => g.items.length > 0 && <section key={g.name} className="vol-group"><h3>{g.name}</h3><div className="grid">{g.items.map(v => <VolunteerCard key={v.slug} volunteer={v}/>)}</div></section>)}{remaining.length > 0 && <section className="vol-group"><h3>أعضاء آخرون</h3><div className="grid">{remaining.map(v => <VolunteerCard key={v.slug} volunteer={v}/>)}</div></section>}</div>}
      </div>
    </main>
  );
}
