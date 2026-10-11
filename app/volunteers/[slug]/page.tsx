import { notFound } from 'next/navigation';
import Avatar from '@/components/Avatar';
import { getVolunteerBySlug, getVolunteers } from '@/lib/supabase';
import Link from 'next/link';
import MembershipCard from '@/components/MembershipCard';
import { CalendarDays, GraduationCap, MapPin, UserRound, Activity, CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
  const v = await getVolunteerBySlug(decodeURIComponent(params.slug));
  if (!v) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sol-team1.vercel.app';
  const profileUrl = `${siteUrl.replace(/\/$/, '')}/volunteers/${encodeURIComponent(v.slug)}`;
  const teams = v.team_names?.length ? v.team_names : (v.team_name ? [v.team_name] : []);
  const stats = [
    {label:'الأعمال والمشاريع',value:v.works?.length || 0},
    {label:'الإنجازات',value:v.achievements?.length || 0},
    {label:'الشهادات',value:v.certificates?.length || 0},
    {label:'المهارات',value:v.skills?.length || 0},
  ];
  return <main className="sol-public-profile" dir="rtl">
    <div className="container">
      <div className="sol-profile-cover"><span className="sol-profile-brand">SOL TEAM · أبناء الأرض</span><div className="sol-profile-cover-caption">نصنع الأثر معاً 💚</div></div>
      <section className="sol-profile-identity">
        <div className="sol-profile-portrait"><Avatar src={v.avatar_url} name={v.full_name} size={150}/></div>
        <div className="sol-profile-maininfo"><span className="sol-profile-kicker">الملف التطوعي العام</span><h1>{v.full_name}</h1><p>{v.role || 'متطوع'}</p><span className={`status-badge ${statusClass[v.volunteer_status || 'active']}`}>{statusLabels[v.volunteer_status || 'active']}</span></div>
        <Link className="btn sol-profile-id-link" href={`/volunteers/${encodeURIComponent(v.slug)}/card`}><CreditCard size={18}/> عرض بطاقة ID</Link>
      </section>
      <div className="sol-profile-facts">
        {teams.length>0&&<span>🤝 {teams.join(' • ')}</span>}
        {v.department&&<span>🏢 {v.department}</span>}
        {(v.joined_date||v.joined_year)&&<span>📅 منذ {v.joined_date||v.joined_year}</span>}
        {v.location&&<span>📍 {v.location}</span>}
      </div>
      <section className="sol-profile-stat-grid" aria-label="إحصائيات المتطوع">{stats.map(x=><div className="sol-profile-stat" key={x.label}><strong>{x.value}</strong><span>{x.label}</span></div>)}</section>
      <div className="sol-profile-sections">
        {v.bio&&<section className="card"><h2>نبذة عن المتطوع</h2><p>{v.bio}</p></section>}
        {v.motivation&&<section className="card"><h2>دافعي للتطوع</h2><p>{v.motivation}</p></section>}
        {v.skills?.length>0&&<section className="card"><h2>المهارات</h2><div className="pill-row">{v.skills.map((x,i)=><span className="pill" key={i}>{x}</span>)}</div></section>}
        {v.works?.length>0&&<ListBlock title="الأعمال والمشاريع" items={v.works}/>}
        {v.achievements?.length>0&&<ListBlock title="الإنجازات" items={v.achievements}/>}
        {v.certificates?.length>0&&<ListBlock title="الشهادات" items={v.certificates}/>}
      </div>
      <section className="sol-profile-membership"><h2>بطاقة الهوية التطوعية ID</h2><p>البطاقة متاحة للجميع بدون تسجيل دخول، ويمكن تحميلها بصيغة PDF أو طباعتها.</p><MembershipCard volunteer={v} url={profileUrl}/></section>
    </div>
  </main>;
}
