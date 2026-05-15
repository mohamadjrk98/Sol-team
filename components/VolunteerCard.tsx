import Link from 'next/link';
import { ArrowLeft, CalendarDays, ShieldCheck } from 'lucide-react';
import Avatar from './Avatar';
import { Volunteer } from '@/lib/types';

const statusLabels: Record<string, string> = { active: 'نشط', left: 'غادر', dismissed: 'تم فصله', vacation: 'إجازة', paused: 'معلّق' };
const statusClass: Record<string, string> = { active: 'green', left: 'gray', dismissed: 'red', vacation: 'yellow', paused: 'orange' };

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const status = volunteer.volunteer_status || 'active';
  return <article className="card vol-card luxury-vol-card">
    <div className="card-shine" />
    <span className={`status-badge ${statusClass[status]}`}>{statusLabels[status]}</span>
    <Avatar src={volunteer.avatar_url} name={volunteer.full_name}/>
    <h3>{volunteer.full_name}</h3>
    <p className="muted role-line"><ShieldCheck size={16}/> {volunteer.role || 'عضو في فريق أبناء الأرض'}</p>
    <div className="pill-row center">
      {volunteer.department && <span className="pill yellow">{volunteer.department}</span>}
      {volunteer.team_name && <span className="pill">{volunteer.team_name}</span>}
    </div>
    {(volunteer.joined_date || volunteer.joined_year) && <p className="muted join-line"><CalendarDays size={16}/> تاريخ الانضمام: {volunteer.joined_date || volunteer.joined_year}</p>}
    <p className="muted" style={{ minHeight: 52 }}>{volunteer.bio?.slice(0, 95) || 'صفحة تعريفية للمتطوع وأعماله وإنجازاته.'}</p>
    <Link className="btn secondary" href={`/volunteers/${volunteer.slug}`}>عرض البطاقة <ArrowLeft size={16}/></Link>
  </article>;
}
