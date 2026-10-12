import {NextResponse} from 'next/server';
import {isAdminRequest} from '@/lib/admin-auth';
import {supabaseAdmin} from '@/lib/supabase';
import {validText,apiError} from '@/lib/v22';
export const dynamic='force-dynamic';
function deny(req:Request){return !isAdminRequest(req)?NextResponse.json({error:'غير مصرح'},{status:401}):null}
export async function GET(req:Request){const d=deny(req);if(d)return d;if(!supabaseAdmin)return NextResponse.json({error:'Supabase not configured'},{status:503});
 const tables=['sol_events','sol_event_signups','sol_attendance','sol_certificates'] as const;
 const rs=await Promise.all(tables.map(t=>supabaseAdmin!.from(t).select('*').order('created_at',{ascending:false}).limit(500)));
 const err=rs.find(r=>r.error);if(err)return NextResponse.json({error:apiError(err.error)},{status:503});
 const [events,signups,attendance,certificates]=rs.map(r=>r.data||[]);
 return NextResponse.json({events,signups,attendance,certificates,notifications:{pendingSignups:signups.filter((s:any)=>s.status==='pending').length}});
}
export async function POST(req:Request){const d=deny(req);if(d)return d;if(!supabaseAdmin)return NextResponse.json({error:'Supabase not configured'},{status:503});
 const b=await req.json().catch(()=>null);if(!b)return NextResponse.json({error:'Invalid JSON'},{status:400});
 const action=validText(b.action,40);let error:any=null;let result:any=null;
 if(action==='event'){
  const title=validText(b.title,180),starts=validText(b.starts_at,40),ends=validText(b.ends_at,40);
  if(title.length<3||!Number.isFinite(Date.parse(starts))||!Number.isFinite(Date.parse(ends))||Date.parse(ends)<=Date.parse(starts))return NextResponse.json({error:'تأكد من العنوان وتوقيت البداية والنهاية'},{status:400});
  const payload={title,description:validText(b.description,2000),location:validText(b.location,200),starts_at:new Date(starts).toISOString(),ends_at:new Date(ends).toISOString(),capacity:Math.max(0,Math.min(100000,Number(b.capacity)||0)),status:b.status==='draft'?'draft':'published'};
  const r=b.id?await supabaseAdmin.from('sol_events').update(payload).eq('id',String(b.id)).select().single():await supabaseAdmin.from('sol_events').insert(payload).select().single();error=r.error;result=r.data;
 }else if(action==='signup_status'){
  if(!['pending','accepted','rejected'].includes(b.status))return NextResponse.json({error:'Invalid status'},{status:400});
  const r=await supabaseAdmin.from('sol_event_signups').update({status:b.status}).eq('id',String(b.id)).select().single();error=r.error;result=r.data;
 }else if(action==='attendance'){
  const hours=Number(b.hours);if(!Number.isFinite(hours)||hours<0||hours>24)return NextResponse.json({error:'الساعات بين 0 و24'},{status:400});
  const r=await supabaseAdmin.from('sol_attendance').upsert({event_id:String(b.event_id),volunteer_slug:validText(b.volunteer_slug,150),hours,attended:b.attended!==false},{onConflict:'event_id,volunteer_slug'}).select().single();error=r.error;result=r.data;
 }else if(action==='certificate'){
  const name=validText(b.full_name,120),eventId=validText(b.event_id,60);if(name.length<3||!eventId)return NextResponse.json({error:'الاسم والفعالية مطلوبان'},{status:400});
  const r=await supabaseAdmin.from('sol_certificates').insert({full_name:name,event_id:eventId,volunteer_slug:validText(b.volunteer_slug,150)||null}).select().single();error=r.error;result=r.data;
 }else return NextResponse.json({error:'Unknown action'},{status:400});
 if(error)return NextResponse.json({error:apiError(error)},{status:400});return NextResponse.json({ok:true,result});
}
