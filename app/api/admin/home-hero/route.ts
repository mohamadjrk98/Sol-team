import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
const KEY='__SOL_HOME_HERO_IMAGE__';
function guard(req:Request){if(!isAdminRequest(req))return NextResponse.json({error:'انتهت جلسة الإدارة'},{status:401});if(!supabaseAdmin)return NextResponse.json({error:'Supabase غير مهيأ'},{status:500});return null}
export async function GET(req:Request){const d=guard(req);if(d)return d;const {data,error}=await supabaseAdmin!.from('home_banners').select('id,image_url').eq('title',KEY).limit(1).maybeSingle();if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({image_url:data?.image_url||'/team-banner.jpg'});}
export async function PUT(req:Request){const d=guard(req);if(d)return d;const body=await req.json().catch(()=>({}));const url=String(body.image_url||'').trim();if(url.length>1500||!/^https:\/\/[^\s]+$/i.test(url))return NextResponse.json({error:'ارفع صورة أولاً من زر رفع الصورة'},{status:400});
const db=supabaseAdmin!;const {data:existing,error:lookupError}=await db.from('home_banners').select('id').eq('title',KEY).limit(1).maybeSingle();if(lookupError)return NextResponse.json({error:lookupError.message},{status:500});
const payload={title:KEY,subtitle:'',image_url:url,button_text:'',button_url:'',sort_order:9999,is_active:true};
const result=existing?.id?await db.from('home_banners').update(payload).eq('id',existing.id):await db.from('home_banners').insert(payload);
if(result.error)return NextResponse.json({error:result.error.message},{status:500});return NextResponse.json({ok:true,image_url:url});}
