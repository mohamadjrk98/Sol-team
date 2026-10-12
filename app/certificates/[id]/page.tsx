import {supabaseAdmin} from '@/lib/supabase';
import {notFound} from 'next/navigation';
import {QRCodeSVG} from 'qrcode.react';
export const dynamic='force-dynamic';
export default async function CertificatePage({params}:{params:{id:string}}){
 if(!supabaseAdmin||!/^[-a-f0-9]{36}$/i.test(params.id))notFound();
 const {data:c}=await supabaseAdmin.from('sol_certificates').select('id,full_name,issued_at,event_id').eq('id',params.id).maybeSingle();if(!c)notFound();
 const {data:e}=await supabaseAdmin.from('sol_events').select('title,starts_at').eq('id',c.event_id).maybeSingle();
 const url=`${process.env.NEXT_PUBLIC_SITE_URL||'https://sol-team1.vercel.app'}/certificates/${c.id}`;
 return <main className="container sol-v22-cert-page"><article className="sol-v22-cert"><span>فريق أبناء الأرض التطوعي • SOL TEAM</span><h1>شهادة مشاركة وتقدير</h1><p>يتقدم الفريق بالشكر والتقدير إلى</p><h2>{c.full_name}</h2><p>تقديراً للمشاركة في فعالية</p><h3>{e?.title||'إحدى فعاليات الفريق'}</h3><p>تاريخ الإصدار: {new Date(c.issued_at).toLocaleDateString('ar')}</p><div className="sol-v22-qr"><QRCodeSVG value={url} size={110}/><small>امسح الرمز للتحقق من صحة الشهادة</small></div><small>رقم التحقق: {c.id}</small></article><div className="sol-v22-cert-actions"><a className="btn secondary" href="/events">الفعاليات</a></div></main>;
}
