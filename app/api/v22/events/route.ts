import {NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase';
export const dynamic='force-dynamic';
export async function GET(){
 if(!supabaseAdmin)return NextResponse.json({events:[],setup:true});
 const {data,error}=await supabaseAdmin.from('sol_events').select('id,title,description,location,starts_at,ends_at,capacity,status').eq('status','published').gte('starts_at',new Date(Date.now()-86400000).toISOString()).order('starts_at',{ascending:true}).limit(60);
 if(error)return NextResponse.json({events:[],setup:true});
 return NextResponse.json({events:data||[]},{headers:{'Cache-Control':'no-store'}});
}
