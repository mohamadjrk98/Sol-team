import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase';
export const dynamic='force-dynamic';
const rate=new Map<string,{count:number;until:number}>();
export async function GET(){
 if(!supabaseAdmin)return NextResponse.json({error:'الخدمة غير مهيأة'},{status:503});
 const {data,error}=await supabaseAdmin.from('gratitude_messages').select('id,sender_name,recipient_name,message,is_anonymous,created_at').eq('status','published').order('created_at',{ascending:false}).limit(60);
 if(error)return NextResponse.json({error:'تعذر تحميل الرسائل'},{status:503});
 return NextResponse.json({messages:(data||[]).map(x=>({...x,sender_name:x.is_anonymous?'فاعل خير':x.sender_name}))},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:Request){
 if(!supabaseAdmin)return NextResponse.json({error:'الخدمة غير مهيأة'},{status:503});
 const origin=req.headers.get('origin');const host=req.headers.get('host');
 if(origin&&host){try{if(new URL(origin).host!==host)return NextResponse.json({error:'طلب غير مسموح'},{status:403})}catch{return NextResponse.json({error:'طلب غير صالح'},{status:400})}}
 const ip=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();const now=Date.now();
 const prev=rate.get(ip);if(prev&&prev.until>now&&prev.count>=3)return NextResponse.json({error:'وصلت للحد المؤقت. حاول لاحقاً.'},{status:429});
 if(rate.size>4000)rate.clear();rate.set(ip,{count:prev&&prev.until>now?prev.count+1:1,until:now+3600000});
 let b:any;try{b=await req.json()}catch{return NextResponse.json({error:'بيانات غير صالحة'},{status:400})}
 if(typeof b.website!=='undefined'&&String(b.website).trim())return NextResponse.json({ok:true});
 const sender_name=String(b.sender_name||'').trim(),recipient_name=String(b.recipient_name||'').trim(),message=String(b.message||'').trim();
 if(sender_name.length<2||sender_name.length>60||recipient_name.length<2||recipient_name.length>80||message.length<10||message.length>600)return NextResponse.json({error:'تأكد من أطوال الاسم والرسالة'},{status:400});
 if(/[<>]/.test(sender_name+recipient_name+message)||/https?:\/\/|www\./i.test(message))return NextResponse.json({error:'لا يمكن إرسال روابط أو رموز HTML'},{status:400});
 const {error}=await supabaseAdmin.from('gratitude_messages').insert({sender_name,recipient_name,message,is_anonymous:b.is_anonymous===true,status:'published'});
 if(error)return NextResponse.json({error:'تعذر حفظ الرسالة. تأكد من تطبيق SQL.'},{status:503});
 return NextResponse.json({ok:true},{status:201});
}
