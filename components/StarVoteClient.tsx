'use client';
import { useEffect, useMemo, useState } from 'react';
import { Send, Star, Trophy } from 'lucide-react';
import type { Volunteer } from '@/lib/types';

type VoteResult = { volunteer_slug:string; votes:number };
export default function StarVoteClient({ volunteers }: { volunteers: Volunteer[] }) {
  const [selected, setSelected] = useState(volunteers[0]?.slug || '');
  const [voterName, setVoterName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const resultMap = useMemo(() => Object.fromEntries(results.map(r => [r.volunteer_slug, r.votes])), [results]);
  const top = [...volunteers].sort((a,b)=>(resultMap[b.slug]||0)-(resultMap[a.slug]||0))[0];
  async function load(){ const res = await fetch('/api/star-vote'); const json = await res.json(); setResults(json.results || []); }
  useEffect(()=>{ load(); }, []);
  async function vote(){ setMessage(''); setError(''); setLoading(true); const res = await fetch('/api/star-vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({volunteer_slug:selected,voter_name:voterName})}); const json=await res.json(); setLoading(false); if(!res.ok)return setError(json.error||'تعذر التصويت'); setMessage('تم تسجيل صوتك، شكراً لمشاركتك.'); await load(); }
  return <div className="star-vote-layout">
    <div className="card star-vote-card"><Star size={46}/><h2>صوّت لنجم الأسبوع</h2><p className="muted">اختر المتطوع الذي ترى أنه كان الأكثر تأثيراً هذا الأسبوع.</p>{message&&<p className="success">{message}</p>}{error&&<p className="error">{error}</p>}<label className="label">اسمك اختياري<input className="input" value={voterName} onChange={e=>setVoterName(e.target.value)} placeholder="اكتب اسمك إن أردت"/></label><label className="label">اختر المتطوع<select className="input" value={selected} onChange={e=>setSelected(e.target.value)}>{volunteers.map(v=><option key={v.slug} value={v.slug}>{v.full_name} — {v.team_name || v.role}</option>)}</select></label><button className="btn" onClick={vote} disabled={loading || !selected}><Send size={18}/> {loading?'جارٍ التصويت...':'تصويت'}</button></div>
    <aside className="card star-results-card"><Trophy size={44}/><h3>ترتيب الأسبوع</h3>{top&&<p className="muted">المتصدر حالياً: <strong>{top.full_name}</strong></p>}<div className="vote-results-list">{volunteers.map(v=><div key={v.slug} className="vote-result-row"><span>{v.full_name}</span><strong>{resultMap[v.slug] || 0}</strong></div>)}</div></aside>
  </div>
}
