import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
const VOTE_COOKIE='sol_star_vote';const WEEK=7*24*60*60;
export async function GET(){if(!supabaseAdmin)return NextResponse.json({results:[]});const{data,error}=await supabaseAdmin.from('weekly_star_votes').select('volunteer_slug').gte('created_at',new Date(Date.now()-WEEK*1000).toISOString());if(error)return NextResponse.json({results:[]});const counts:Record<string,number>={};for(const row of data||[])counts[row.volunteer_slug]=(counts[row.volunteer_slug]||0)+1;return NextResponse.json({results:Object.entries(counts).map(([volunteer_slug,votes])=>({volunteer_slug,votes}))})}
export async function POST(req:Request){
 const cookie=req.headers.get('cookie')||'';if(new RegExp(`(?:^|;\\s*)${VOTE_COOKIE}=`).test(cookie))return NextResponse.json({error:'تم تسجيل تصويت من هذا الجهاز خلال آخر 7 أيام.'},{status:429});
 const body=await req.json().catch(()=>({}));const volunteer_slug=String(body.volunteer_slug||'').trim();const voter_name=String(body.voter_name||'').trim().slice(0,80)||null;if(!volunteer_slug)return NextResponse.json({error:'يرجى اختيار متطوع.'},{status:400});
 if(!supabaseAdmin)return NextResponse.json({error:'نظام التصويت غير متصل بقاعدة البيانات حالياً.'},{status:503});
 const{data:vol}=await supabaseAdmin.from('volunteers').select('slug,volunteer_status').eq('slug',volunteer_slug).maybeSingle();if(!vol||vol.volunteer_status!=='active')return NextResponse.json({error:'المتطوع المحدد غير متاح للتصويت حالياً.'},{status:400});
 const{error}=await supabaseAdmin.from('weekly_star_votes').insert({volunteer_slug,voter_name});if(error)return NextResponse.json({error:'تعذر تسجيل التصويت حالياً.',details:error.message,code:error.code},{status:500});
 const res=NextResponse.json({ok:true});res.cookies.set(VOTE_COOKIE,volunteer_slug,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:WEEK});return res;
}
