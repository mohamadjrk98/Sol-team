import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase';
import {validText,apiError} from '@/lib/v22';
export async function POST(req:Request){
 if(!supabaseAdmin)return NextResponse.json({error:'الخدمة غير مهيأة'},{status:503});
 const origin=req.headers.get('origin');const host=req.headers.get('host');
 if(origin&&host){try{if(new URL(origin).host!==host)return NextResponse.json({error:'طلب غير مسموح'},{status:403})}catch{return NextResponse.json({error:'طلب غير صالح'},{status:400})}}
 const b=await req.json().catch(()=>null);if(!b||b.website)return NextResponse.json({error:'طلب غير صالح'},{status:400});
 const name=validText(b.name,100),contact=validText(b.contact,120),eventId=validText(b.event_id,60);
 if(name.length<3||contact.length<5||!/^[-a-f0-9]{36}$/i.test(eventId))return NextResponse.json({error:'تحقق من الاسم ووسيلة التواصل والفعالية'},{status:400});
 const {data:ev,error:evErr}=await supabaseAdmin.from('sol_events').select('id,starts_at,status').eq('id',eventId).maybeSingle();
 if(evErr||!ev||ev.status!=='published'||new Date(ev.starts_at).getTime()<Date.now())return NextResponse.json({error:'الفعالية غير متاحة للتسجيل'},{status:400});
 const {error}=await supabaseAdmin.from('sol_event_signups').insert({event_id:eventId,full_name:name,contact,notes:validText(b.notes,500)});
 if(error)return NextResponse.json({error:apiError(error)},{status:400});
 return NextResponse.json({ok:true,message:'تم إرسال طلب المشاركة للإدارة'});
}
