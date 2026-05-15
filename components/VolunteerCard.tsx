import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Avatar from './Avatar';
import { Volunteer } from '@/lib/types';

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  return <article className="card vol-card"><Avatar src={volunteer.avatar_url} name={volunteer.full_name}/><h3>{volunteer.full_name}</h3><p className="muted">{volunteer.role || 'عضو في فريق أبناء الأرض'}</p>{volunteer.team_name && <span className="pill">{volunteer.team_name}</span>}<p className="muted" style={{ minHeight: 52 }}>{volunteer.bio?.slice(0, 95) || 'صفحة تعريفية للمتطوع وأعماله وإنجازاته.'}</p><Link className="btn secondary" href={`/volunteers/${volunteer.slug}`}>عرض الملف <ArrowLeft size={16}/></Link></article>;
}
