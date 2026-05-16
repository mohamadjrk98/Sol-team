import VolunteerCard from '@/components/VolunteerCard';
import { getVolunteers } from '@/lib/supabase';

export const revalidate = 60;

export default async function VolunteersPage() {
  const volunteers = await getVolunteers();
  const sorted = [...volunteers].sort((a, b) => (a.position_rank ?? 999) - (b.position_rank ?? 999));
  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow dark-label">فريقنا</span>
            <h2>المتطوعون والهيكل التنظيمي</h2>
            <p className="muted">تعرف على أعضاء فريق أبناء الأرض التطوعي حسب التراتبية والفرق وحالة العضوية.</p>
          </div>
        </div>
        {volunteers.length === 0 ? <div className="empty">لا يوجد متطوعون حالياً.</div> : <div className="grid">{sorted.map(v => <VolunteerCard key={v.slug} volunteer={v}/>)}</div>}
      </div>
    </main>
  );
}
