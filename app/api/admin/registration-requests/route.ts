import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase';
import {isAdminRequest} from '@/lib/admin-auth';
export const runtime='nodejs';
export async function GET(req:Request){
 if(!isAdminRequest(req))return NextResponse.json({error:'يجب تسجيل دخول الإدارة'},{status:401});
 if(!supabaseAdmin)return NextResponse.json({error:'Supabase غير مهيأ'},{status:503});
 const {data,error}=await supabaseAdmin.from('volunteer_registration_requests').select('*').order('created_at',{ascending:false}).limit(150);
 if(error)return NextResponse.json({error:'جدول الطلبات غير مهيأ'},{status:503});
 const rows=await Promise.all((data||[]).map(async row=>{const {data:img}=await supabaseAdmin!.storage.from('volunteer-registration-private').createSignedUrl(row.avatar_path,600);return {...row,preview_url:img?.signedUrl||''}}));
 return NextResponse.json({requests:rows},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:Request){
 if(!isAdminRequest(req))return NextResponse.json({error:'يجب تسجيل دخول الإدارة'},{status:401});
 if(!supabaseAdmin)return NextResponse.json({error:'Supabase غير مهيأ'},{status:503});
 let body:any;try{body=await req.json()}catch{return NextResponse.json({error:'طلب غير صالح'},{status:400})}
 const id=String(body.id||''),action=String(body.action||'');if(!/^[0-9a-f-]{36}$/i.test(id)||!['approve','reject'].includes(action))return NextResponse.json({error:'بيانات غير صالحة'},{status:400});
 const {data:row,error}=await supabaseAdmin.from('volunteer_registration_requests').select('*').eq('id',id).single();if(error||!row)return NextResponse.json({error:'الطلب غير موجود'},{status:404});
 if(row.status!=='pending')return NextResponse.json({error:'تمت معالجة الطلب سابقاً'},{status:409});
 if(action==='reject'){const r=await supabaseAdmin.from('volunteer_registration_requests').update({status:'rejected',reviewed_at:new Date().toISOString()}).eq('id',id).eq('status','pending').select('id');if(r.error||!r.data?.length)return NextResponse.json({error:'تعذر الرفض'},{status:409});return NextResponse.json({ok:true})}
 const bucket=supabaseAdmin.storage.from('volunteer-registration-private');const {data:photo,error:photoError}=await bucket.download(row.avatar_path);if(photoError||!photo)return NextResponse.json({error:'تعذر تحميل الصورة'},{status:500});
 const ext=row.avatar_path.split('.').pop()||'jpg',slug=`volunteer-${id.slice(0,8)}`,photoPath=`${slug}/${crypto.randomUUID()}.${ext}`,mime=ext==='png'?'image/png':ext==='webp'?'image/webp':'image/jpeg';
 const publicBucket=supabaseAdmin.storage.from('volunteer-photos');const upload=await publicBucket.upload(photoPath,await photo.arrayBuffer(),{contentType:mime,upsert:false});if(upload.error)return NextResponse.json({error:'تعذر نقل الصورة'},{status:500});
 const {data:url}=publicBucket.getPublicUrl(photoPath);
 const {error:insertError}=await supabaseAdmin.from('volunteers').insert({slug,full_name:row.full_name,role:row.role||'متطوع',hierarchy_level:'volunteer',department:'المتطوعون',team_name:row.team_name,team_names:row.team_name==='غير محدد بعد'?[]:[row.team_name],position_rank:100,avatar_url:url.publicUrl,specialization:row.specialization||null,volunteer_status:'active',is_featured:false});
 if(insertError){await publicBucket.remove([photoPath]);return NextResponse.json({error:'تعذر إنشاء البطاقة: '+insertError.message},{status:500})}
 const update=await supabaseAdmin.from('volunteer_registration_requests').update({status:'approved',volunteer_slug:slug,reviewed_at:new Date().toISOString()}).eq('id',id).eq('status','pending').select('id');
 if(update.error||!update.data?.length)return NextResponse.json({error:'أُنشئت البطاقة لكن تعذر تحديث الطلب؛ راجع المتطوعين قبل المحاولة مجدداً'},{status:500});
 return NextResponse.json({ok:true,slug});
}
