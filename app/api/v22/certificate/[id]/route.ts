import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:{id:string}}){
 if(!supabaseAdmin||!/^[-a-f0-9]{36}$/i.test(params.id))return NextResponse.json({valid:false},{status:404});
 const {data,error}=await supabaseAdmin.from('sol_certificates').select('id,full_name,issued_at,event_id').eq('id',params.id).maybeSingle();
 if(error||!data)return NextResponse.json({valid:false},{status:404});
 const {data:event}=await supabaseAdmin.from('sol_events').select('title,starts_at').eq('id',data.event_id).maybeSingle();
 return NextResponse.json({valid:true,certificate:{id:data.id,name:data.full_name,issued_at:data.issued_at,event:event?.title||'',event_date:event?.starts_at||''}});
}
