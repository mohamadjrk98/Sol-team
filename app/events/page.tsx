import {supabaseAdmin} from '@/lib/supabase';
import SolEventSignup from '@/components/SolEventSignup';
export const dynamic='force-dynamic';
export default async function EventsPage(){
 let events:any[]=[];if(supabaseAdmin){const r=await supabaseAdmin.from('sol_events').select('id,title,description,location,starts_at,ends_at,status').eq('status','published').gte('starts_at',new Date(Date.now()-86400000).toISOString()).order('starts_at',{ascending:true}).limit(60);events=r.data||[]}
 return <main className="sol-v9-inner"><section className="hero sol-v9-page-hero"><div className="container"><span className="eyebrow">شارك معنا</span><h1>الفعاليات والأنشطة القادمة</h1><p className="lead">تابع أنشطة فريق أبناء الأرض وسجّل رغبتك بالمشاركة.</p></div></section><section className="section"><div className="container sol-v22-events-grid">{events.length===0&&<div className="card">لا توجد فعاليات منشورة قادمة حالياً.</div>}{events.map(e=><article className="card sol-v22-event" key={e.id}><span className="section-kicker">{new Date(e.starts_at).toLocaleDateString('ar',{year:'numeric',month:'long',day:'numeric'})}</span><h2>{e.title}</h2><p>{e.description}</p><p className="muted">📍 {e.location||'يحدد لاحقاً'}</p><p className="muted">🕒 {new Date(e.starts_at).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'})}</p><SolEventSignup eventId={e.id}/></article>)}</div></section></main>
}
