import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/admin-auth';
const MAX_SIZE=2*1024*1024;const ALLOWED=['image/jpeg','image/jpg','image/png','image/webp'];const BUCKET='volunteer-photos';
function safeName(name:string){const ext=name.split('.').pop()?.toLowerCase()||'jpg';return `${Date.now()}-${crypto.randomUUID().slice(0,8)}.${ext}`}
export async function POST(req:Request){
 if(!isAdminRequest(req))return NextResponse.json({error:'انتهت جلسة الإدارة أو لا تملك صلاحية.'},{status:401});
 if(!supabaseAdmin)return NextResponse.json({error:'إعدادات Supabase الخاصة بالإدارة غير مكتملة.'},{status:500});
 const form=await req.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'لم يتم اختيار صورة.'},{status:400});if(!ALLOWED.includes(file.type))return NextResponse.json({error:'نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WEBP.'},{status:400});if(file.size>MAX_SIZE)return NextResponse.json({error:'حجم الصورة يجب ألا يتجاوز 2MB.'},{status:400});
 const slug=String(form.get('slug')||'volunteer').trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF-]+/g,'-').replace(/^-+|-+$/g,'')||'volunteer';const path=`${slug}/${safeName(file.name)}`;const buffer=Buffer.from(await file.arrayBuffer());const{error}=await supabaseAdmin.storage.from(BUCKET).upload(path,buffer,{contentType:file.type,cacheControl:'31536000',upsert:true});if(error)return NextResponse.json({error:error.message},{status:500});const{data}=supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);return NextResponse.json({ok:true,url:data.publicUrl,path});
}
