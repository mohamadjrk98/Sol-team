import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(req:Request){
 const body=await req.json().catch(()=>({}));
 const email=String(body.email||'').trim().toLowerCase();const full_name=String(body.full_name||'').trim();const phone=String(body.phone||'').trim();const ageRaw=Number(body.age||0);const age=Number.isFinite(ageRaw)&&ageRaw>0?ageRaw:null;const city=String(body.city||'').trim();const specialization=String(body.specialization||'').trim();const preferred_team=String(body.preferred_team||'').trim();const motivation=String(body.motivation||'').trim();const availability=String(body.availability||'').trim();const experience=String(body.experience||'').trim();
 if(full_name.length<3)return NextResponse.json({error:'يرجى إدخال الاسم الكامل بشكل صحيح.'},{status:400});
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({error:'يرجى إدخال بريد إلكتروني صحيح.'},{status:400});
 if(phone.length<7)return NextResponse.json({error:'يرجى إدخال رقم هاتف صحيح للتواصل.'},{status:400});
 if(age!==null&&(age<12||age>80))return NextResponse.json({error:'يرجى التحقق من العمر المدخل.'},{status:400});
 if(motivation.length<15)return NextResponse.json({error:'اكتب سبب التطوع بشكل أوضح (15 حرفاً على الأقل).'},{status:400});
 const payload={email,full_name,phone,age,city,specialization,preferred_team,motivation,availability,experience,status:'new'};
 if(supabaseAdmin){const{error}=await supabaseAdmin.from('join_applications').upsert(payload,{onConflict:'email'});if(error)return NextResponse.json({error:'تعذر حفظ الطلب حالياً. حاول مرة أخرى لاحقاً.'},{status:500});return NextResponse.json({ok:true})}
 if(supabase){const{error}=await supabase.from('join_applications').insert(payload);if(error){if(error.code==='23505')return NextResponse.json({error:'يوجد طلب سابق مرتبط بهذا البريد. سيتم التواصل معك عند مراجعته.'},{status:409});return NextResponse.json({error:'تعذر حفظ الطلب حالياً.'},{status:500})}return NextResponse.json({ok:true})}
 return NextResponse.json({error:'نظام استقبال الطلبات غير متصل بقاعدة البيانات حالياً. تواصل مع الإدارة.'},{status:503});
}
