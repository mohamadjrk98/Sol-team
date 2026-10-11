import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase';
export const runtime='nodejs';
const teams=['مكتب المؤثرات الإعلامية والتمكين البشري','فريق الدراسات العامة','فريق الخدمات الميدانية','فريق التبرعات','غير محدد بعد'];
export async function POST(req:Request){
 if(!supabaseAdmin)return NextResponse.json({error:'الخدمة غير مهيأة'},{status:503});
 if(Number(req.headers.get('content-length')||0)>3*1024*1024)return NextResponse.json({error:'الطلب كبير جداً'},{status:413});
 let f:FormData;try{f=await req.formData()}catch{return NextResponse.json({error:'بيانات غير صالحة'},{status:400})}
 const full_name=String(f.get('full_name')||'').trim().replace(/\s+/g,' '),phone=String(f.get('phone')||'').trim(),team_name=String(f.get('team_name')||''),role=String(f.get('role')||'').trim(),specialization=String(f.get('specialization')||'').trim(),avatar=f.get('avatar');
 if(full_name.length<5||full_name.length>120||phone.length>30||!teams.includes(team_name)||!['متطوع','منسق','إدارة','غير ذلك'].includes(role)||specialization.length>120||f.get('consent')!=='yes'||!(avatar instanceof File))return NextResponse.json({error:'تحقق من البيانات والموافقة'},{status:400});
 if(avatar.size<100||avatar.size>2097152||!['image/jpeg','image/png','image/webp'].includes(avatar.type))return NextResponse.json({error:'الصورة غير مدعومة أو أكبر من 2MB'},{status:400});
 const b=Buffer.from(await avatar.arrayBuffer());const jpg=b.length>3&&b[0]===255&&b[1]===216&&b[2]===255;const png=b.length>8&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));const webp=b.length>12&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP';
 if(!(avatar.type==='image/jpeg'&&jpg||avatar.type==='image/png'&&png||avatar.type==='image/webp'&&webp))return NextResponse.json({error:'محتوى الصورة غير صالح'},{status:400});
 const ext=avatar.type==='image/png'?'png':avatar.type==='image/webp'?'webp':'jpg';const path=`pending/${crypto.randomUUID()}.${ext}`;
 const bucket=supabaseAdmin.storage.from('volunteer-registration-private');const up=await bucket.upload(path,b,{contentType:avatar.type,upsert:false});if(up.error)return NextResponse.json({error:'تعذر رفع الصورة، تحقق من إعداد التخزين'},{status:503});
 const {error}=await supabaseAdmin.from('volunteer_registration_requests').insert({full_name,phone,team_name,role,specialization,avatar_path:path,consent:true});
 if(error){await bucket.remove([path]);return NextResponse.json({error:'تعذر حفظ الطلب، تحقق من قاعدة البيانات'},{status:503})}
 return NextResponse.json({ok:true});
}
