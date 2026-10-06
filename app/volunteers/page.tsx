import VolunteerSearch from '@/components/VolunteerSearch';
import { getVolunteers } from '@/lib/supabase';
export const revalidate=60;
export default async function VolunteersPage(){const volunteers=(await getVolunteers()).sort((a,b)=>(a.position_rank??999)-(b.position_rank??999));return <main><section className="inner-hero"><div className="container"><span className="eyebrow">فريقنا</span><h1>أشخاص يجمعهم الأثر</h1><p className="lead small">ابحث عن أعضاء الفريق حسب الاسم والمهارة والفريق والحالة والمستوى التنظيمي.</p></div></section><section className="section"><div className="container">{volunteers.length===0?<div className="empty">لا يوجد متطوعون حالياً.</div>:<VolunteerSearch volunteers={volunteers}/>}</div></section></main>}
