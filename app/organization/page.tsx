import { getVolunteers } from '@/lib/supabase';
import OrganizationChart from '@/components/OrganizationChart';

export const metadata = {
  title: 'الهيكل التنظيمي | SOL TEAM',
  description: 'تعرّف على الهيكل التنظيمي والإدارة والمنسقين والفرق التطوعية.'
};

export const dynamic = 'force-dynamic';

export default async function OrganizationPage() {
  const volunteers = await getVolunteers();

  return (
    <main>
      <section className="inner-hero sol-org-hero">
        <div className="container">
          <span className="eyebrow">SOL TEAM • ORGANIZATION</span>
          <h1>الهيكل التنظيمي</h1>
          <p className="lead small">
            تعرّف على إدارة الفريق ومنسقيه وفرقه التطوعية،
            واستكشف الأعضاء من خلال مخطط تفاعلي.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <OrganizationChart volunteers={volunteers} />
        </div>
      </section>
    </main>
  );
}
