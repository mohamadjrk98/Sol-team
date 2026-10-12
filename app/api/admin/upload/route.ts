import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/admin-auth';
const MAX_SIZE=10*1024*1024;const ALLOWED=['image/jpeg','image/jpg','image/png','image/webp'];const BUCKET='volunteer-photos';
function safeName(name:string){const ext=name.split('.').pop()?.toLowerCase()||'jpg';return `${Date.now()}-${crypto.randomUUID().slice(0,8)}.${ext}`}
export async function POST(req:Request){
 if(!isAdminRequest(req))return NextResponse.json({error:'انتهت جلسة الإدارة أو لا تملك صلاحية.'},{status:401});
 if(!supabaseAdmin)return NextResponse.json({error:'إعدادات Supabase الخاصة بالإدارة غير مكتملة.'},{status:500});
 const form=await req.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'لم يتم اختيار صورة.'},{status:400});if(!ALLOWED.includes(file.type))return NextResponse.json({error:'نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WEBP.'},{status:400});if(file.size>MAX_SIZE)return NextResponse.json({error:'حجم الصورة الأصلية يجب ألا يتجاوز 10MB.'},{status:400});
 const slug=String(form.get('slug')||'volunteer').trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF-]+/g,'-').replace(/^-+|-+$/g,'')||'volunteer';const path=`${slug}/${safeName(file.name)}`;const buffer=Buffer.from(await file.arrayBuffer());
 const jpeg=buffer.length>=3&&buffer[0]===0xff&&buffer[1]===0xd8&&buffer[2]===0xff;
 const png=buffer.length>=8&&buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const webp=buffer.length>=12&&buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP';
 const valid=(file.type==='image/jpeg'||file.type==='image/jpg')&&jpeg||file.type==='image/png'&&png||file.type==='image/webp'&&webp;
 if(!valid)return NextResponse.json({error:'محتوى الملف لا يطابق صيغة الصورة.'},{status:400});
 const{error}=await supabaseAdmin.storage.from(BUCKET).upload(path,buffer,{contentType:file.type,cacheControl:'31536000',upsert:true});if(error)return NextResponse.json({error:error.message},{status:500});const{data}=supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);return NextResponse.json({ok:true,url:data.publicUrl,path});
}
