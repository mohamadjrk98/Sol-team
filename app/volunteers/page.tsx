import VolunteerCard from '@/components/VolunteerCard';
import { getVolunteers } from '@/lib/supabase';

export const revalidate = 60;

export default async function VolunteersPage() {
  const volunteers = await getVolunteers();
  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>المتطوعون</h2>
            <p className="muted">تعرف على أعضاء فريقنا وصفحاتهم الشخصية وأعمالهم وإنجازاتهم.</p>
          </div>
        </div>
        {volunteers.length === 0 ? <div className="empty">لا يوجد متطوعون حالياً.</div> : <div className="grid">{volunteers.map(v => <VolunteerCard key={v.slug} volunteer={v}/>)}</div>}
      </div>
    </main>
  );
}
