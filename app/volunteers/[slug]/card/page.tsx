import { notFound } from 'next/navigation';
import MembershipCard from '@/components/MembershipCard';
import { getVolunteerBySlug, getVolunteers } from '@/lib/supabase';

export const revalidate = 60;

export async function generateStaticParams() {
  const volunteers = await getVolunteers();
  return volunteers.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const volunteer = await getVolunteerBySlug(params.slug);
  return { title: volunteer ? `بطاقة عضوية ${volunteer.full_name}` : 'بطاقة عضوية' };
}

export default async function VolunteerMemberCardPage({ params }: { params: { slug: string } }) {
  const v = await getVolunteerBySlug(params.slug);
  if (!v) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sol-team.vercel.app';
  const profileUrl = `${siteUrl.replace(/\/$/, '')}/volunteers/${v.slug}`;
  return <main className="section print-page">
    <div className="container">
      <div className="section-head no-print"><div><span className="eyebrow dark-label">بطاقة عضوية</span><h2>بطاقة {v.full_name}</h2><p className="muted">يمكنك تحميل البطاقة كملف PDF مباشرة أو طباعتها من الزر المخصص.</p></div></div>
      <MembershipCard volunteer={v} url={profileUrl} />
    </div>
  </main>;
}
