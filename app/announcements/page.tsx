import type { Metadata } from 'next';
import FloatingSidePanel from '@/components/FloatingSidePanel';
import { getSiteSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'إعلانات الفريق',
  description: 'إعلانات الفريق ومواعيده وروابط المشاركة والتطوع.',
};

export default async function AnnouncementsPage() {
  const settings = await getSiteSettings();
  return <main>
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><h1>إعلانات الفريق</h1><p className="muted">آخر التنبيهات والمواعيد وروابط المشاركة.</p></div>
        </div>
        <FloatingSidePanel meetingText={settings.meeting_text}/>
      </div>
    </section>
  </main>;
}
