'use client';

import { useMemo, useState } from 'react';
import VolunteerCard from './VolunteerCard';
import { Volunteer } from '@/lib/types';

const statusLabels: Record<string, string> = { active: 'نشط', vacation: 'إجازة', paused: 'معلّق', left: 'غادر', dismissed: 'تم فصله' };
const hierarchyLabels: Record<string, string> = { board: 'إدارة', coordinator: 'منسق', volunteer: 'متطوع' };

export default function VolunteerSearch({ volunteers }: { volunteers: Volunteer[] }) {
  const [q, setQ] = useState('');
  const [team, setTeam] = useState('all');
  const [status, setStatus] = useState('all');
  const [level, setLevel] = useState('all');

  const teams = useMemo(() => Array.from(new Set(volunteers.map(v => v.team_name).filter(Boolean))) as string[], [volunteers]);
  const filtered = useMemo(() => volunteers.filter(v => {
    const haystack = [v.full_name, v.role, v.department, v.team_name, v.specialization, v.location, ...(v.skills || []), ...(v.works || [])].join(' ').toLowerCase();
    return (!q || haystack.includes(q.toLowerCase())) &&
      (team === 'all' || v.team_name === team) &&
      (status === 'all' || (v.volunteer_status || 'active') === status) &&
      (level === 'all' || v.hierarchy_level === level);
  }), [volunteers, q, team, status, level]);

  return <div className="advanced-search">
    <div className="search-panel card">
      <input className="input" placeholder="ابحث بالاسم، الفريق، المهارة، العمل..." value={q} onChange={e => setQ(e.target.value)} />
      <select className="input" value={team} onChange={e => setTeam(e.target.value)}><option value="all">كل الفرق</option>{teams.map(t => <option key={t}>{t}</option>)}</select>
      <select className="input" value={level} onChange={e => setLevel(e.target.value)}><option value="all">كل المستويات</option>{Object.entries(hierarchyLabels).map(([k,v]) => <option value={k} key={k}>{v}</option>)}</select>
      <select className="input" value={status} onChange={e => setStatus(e.target.value)}><option value="all">كل الحالات</option>{Object.entries(statusLabels).map(([k,v]) => <option value={k} key={k}>{v}</option>)}</select>
      <button className="btn secondary" onClick={() => { setQ(''); setTeam('all'); setLevel('all'); setStatus('all'); }}>إعادة ضبط</button>
    </div>
    <p className="muted result-count">تم العثور على {filtered.length} بطاقة من أصل {volunteers.length}</p>
    <div className="grid">{filtered.map(v => <VolunteerCard key={v.slug} volunteer={v}/>)}</div>
  </div>;
}
