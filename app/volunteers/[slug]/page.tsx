import { notFound } from 'next/navigation';
import Avatar from '@/components/Avatar';
import { getVolunteerBySlug, getVolunteers } from '@/lib/supabase';
import Link from 'next/link';
import MembershipCard from '@/components/MembershipCard';
import { CalendarDays, GraduationCap, MapPin, UserRound, Activity, CreditCard } from 'lucide-react';

export const revalidate = 60;

export async function generateStaticParams() {
  const volunteers = await getVolunteers();
  return volunteers.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const volunteer = await getVolunteerBySlug(params.slug);
  return { title: volunteer ? `${volunteer.full_name} - أبناء الأرض` : 'متطوع - أبناء الأرض' };
}

const statusLabels: Record<string, string> = { active: 'نشط', left: 'غادر', dismissed: 'تم فصله', vacation: 'إجازة', paused: 'معلّق' };
const statusClass: Record<string, string> = { active: 'green', left: 'gray', dismissed: 'red', vacation: 'yellow', paused: 'orange' };

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <section className="card"><h3>{title}</h3>{items.length ? <ul className="list">{items.map((item, i) => <li key={i}>{item}</li>)}</ul> : <p className="muted">لا توجد بيانات بعد.</p>}</section>;
}

export default async function VolunteerProfilePage({ params }: { params: { slug: string } }) {
  const v = await getVolunteerBySlug(params.slug);
  if (!v) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sol-team.vercel.app';
  const profileUrl = `${siteUrl.replace(/\/$/, '')}/volunteers/${v.slug}`;
  return (
    <main className="section">
      <div className="container profile">
        <aside className="card profile-side" style={{ textAlign: 'center' }}>
          <Avatar src={v.avatar_url} name={v.full_name} size={140} />
          <h2 style={{ marginTop: 16 }}>{v.full_name}</h2>
          <p className="muted">{v.role}</p>
          <span className={`status-badge ${statusClass[v.volunteer_status || 'active']}`}>{statusLabels[v.volunteer_status || 'active']}</span>
          <div className="list" style={{ textAlign: 'right', marginTop: 18 }}>
            {v.department && <li>القسم: {v.department}</li>}
            {v.team_name && <li>الفريق: {v.team_name}</li>}
            {v.specialization && <li><GraduationCap size={16}/> التخصص: {v.specialization}</li>}
            {(v.joined_date || v.joined_year) && <li><CalendarDays size={16}/> تاريخ الانضمام: {v.joined_date || v.joined_year}</li>}
            {v.location && <li><MapPin size={16}/> الموقع: {v.location}</li>}
            {v.age && <li><UserRound size={16}/> العمر: {v.age}</li>}
            {v.volunteer_status && <li><Activity size={16}/> الحالة: {statusLabels[v.volunteer_status]}</li>}
          </div>
        </aside>
        <div className="tabs">
          <section className="card"><h3>نبذة شخصية</h3><p className="muted">{v.bio}</p></section>
          <section className="card"><h3>لماذا أتطوع؟</h3><p className="muted">{v.motivation}</p></section>
          <section className="card"><h3>المهارات</h3><div className="pill-row">{v.skills.map(skill => <span className="pill" key={skill}>{skill}</span>)}</div></section>
          <ListBlock title="الأعمال والمشاريع" items={v.works} />
          <ListBlock title="الإنجازات" items={v.achievements} />
          <ListBlock title="الشهادات" items={v.certificates} />
          {v.exit_reason && <section className="card"><h3>ملاحظات الحالة</h3><p className="muted">{v.exit_reason}</p></section>}
          <section className="card"><h3>QR وبطاقة العضوية</h3><p className="muted">يمكن استخدام الرمز للتحقق من صفحة المتطوع، أو طباعة بطاقة عضوية رسمية.</p><Link className="btn" href={`/volunteers/${v.slug}/card`}><CreditCard size={17}/> عرض بطاقة العضوية</Link></section>
          <MembershipCard volunteer={v} url={profileUrl} />
        </div>
      </div>
    </main>
  );
}
