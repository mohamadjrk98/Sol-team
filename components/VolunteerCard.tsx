import Link from 'next/link';
import Avatar from './Avatar';
import { Volunteer } from '@/lib/types';

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  return (
    <article className="card vol-card">
      <Avatar src={volunteer.avatar_url} name={volunteer.full_name} />
      <h3>{volunteer.full_name}</h3>
      <p className="muted">{volunteer.role}</p>
      <div className="pill-row" style={{ justifyContent: 'center', margin: '14px 0' }}>
        {volunteer.specialization && <span className="pill">{volunteer.specialization}</span>}
        {volunteer.joined_year && <span className="pill">منذ {volunteer.joined_year}</span>}
      </div>
      <Link className="btn secondary" href={`/volunteers/${volunteer.slug}`}>عرض الملف الشخصي</Link>
    </article>
  );
}
