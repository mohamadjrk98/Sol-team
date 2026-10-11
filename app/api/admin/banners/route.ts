import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
function guard(req:Request){if(!isAdminRequest(req))return NextResponse.json({error:'غير مصرح'},{status:401});if(!supabaseAdmin)return NextResponse.json({error:'Supabase غير مهيأ'},{status:500});return null}
function clean(body:any){
 const image_url=String(body.image_url||'').trim();
 const button_url=String(body.button_url||'').trim();
 const safe=(u:string)=>{
  if(!u||/[\\\\\x00-\x20\x7f]/.test(u))return false;
  if(u.startsWith('/'))return !u.startsWith('//')&&!u.includes('\\\\');
  try{
   const parsed=new URL(u);
   return parsed.protocol==='https:'&&!!parsed.hostname&&!parsed.username&&!parsed.password;
  }catch{return false}
 };
 if(!safe(image_url)||button_url&&!safe(button_url))return null;
 return {title:String(body.title||'').trim().slice(0,120),subtitle:String(body.subtitle||'').trim().slice(0,280),image_url,button_text:String(body.button_text||'').trim().slice(0,50),button_url,sort_order:Math.max(0,Math.min(9999,Number(body.sort_order)||0)),is_active:body.is_active===true};
}
export async function GET(req:Request){const d=guard(req);if(d)return d;const {data,error}=await supabaseAdmin!.from('home_banners').select('*').order('sort_order');return error?NextResponse.json({error:error.message},{status:500}):NextResponse.json({banners:data||[]})}
export async function POST(req:Request){const d=guard(req);if(d)return d;const body=await req.json();const value=clean(body);if(!value||!value.title||!value.image_url)return NextResponse.json({error:'تحقق من العنوان وروابط الصور'},{status:400});const {error}=await supabaseAdmin!.from('home_banners').insert(value);return error?NextResponse.json({error:error.message},{status:500}):NextResponse.json({ok:true})}
export async function PUT(req:Request){const d=guard(req);if(d)return d;const body=await req.json();const value=clean(body);if(!value||!value.title||!body.id)return NextResponse.json({error:'بيانات غير مكتملة'},{status:400});const {error}=await supabaseAdmin!.from('home_banners').update(value).eq('id',String(body.id));return error?NextResponse.json({error:error.message},{status:500}):NextResponse.json({ok:true})}
export async function DELETE(req:Request){const d=guard(req);if(d)return d;const id=new URL(req.url).searchParams.get('id');if(!id)return NextResponse.json({error:'معرّف مطلوب'},{status:400});const {error}=await supabaseAdmin!.from('home_banners').delete().eq('id',id);return error?NextResponse.json({error:error.message},{status:500}):NextResponse.json({ok:true})}
