import VolunteerSearch from '@/components/VolunteerSearch';
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
            <span className="eyebrow dark-label">بحث متقدم</span>
            <h2>المتطوعون والهيكل التنظيمي</h2>
            <p className="muted">ابحث وفرز أعضاء فريق أبناء الأرض حسب الاسم، الفريق، المستوى التنظيمي، الحالة، المهارات، والأعمال.</p>
          </div>
        </div>
        {volunteers.length === 0 ? <div className="empty">لا يوجد متطوعون حالياً.</div> : <VolunteerSearch volunteers={sorted} />}
      </div>
    </main>
  );
}
