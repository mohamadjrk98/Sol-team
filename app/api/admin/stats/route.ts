import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/admin-auth';
export async function GET(req:Request){
 if(!isAdminRequest(req))return NextResponse.json({error:'انتهت جلسة الإدارة أو لا تملك صلاحية.'},{status:401});
 if(!supabaseAdmin)return NextResponse.json({error:'إعدادات Supabase الخاصة بالإدارة غير مكتملة.'},{status:500});
 const [vr,ir,ar,mr]=await Promise.all([supabaseAdmin.from('volunteers').select('volunteer_status,hierarchy_level,team_name,created_at'),supabaseAdmin.from('initiatives').select('status,category,team,date'),supabaseAdmin.from('join_applications').select('status,preferred_team,created_at'),supabaseAdmin.from('impact_metrics').select('label,value,suffix,description')]);
 const firstError=vr.error||ir.error||ar.error||mr.error;if(firstError)return NextResponse.json({error:firstError.message},{status:500});
 const v=vr.data||[],i=ir.data||[],a=ar.data||[],metrics=mr.data||[];
 const group=(rows:any[],key:string,fallback:string)=>rows.reduce((acc:Record<string,number>,x:any)=>{const k=x[key]||fallback;acc[k]=(acc[k]||0)+1;return acc},{});
 const byStatus=group(v,'volunteer_status','active'),byHierarchy=group(v,'hierarchy_level','volunteer'),byTeam=group(v,'team_name','غير محدد'),initiativesByStatus=group(i,'status','planned'),applicationsByStatus=group(a,'status','new');
 return NextResponse.json({totals:{volunteers:v.length,activeVolunteers:byStatus.active||0,initiatives:i.length,inProgressInitiatives:initiativesByStatus.in_progress||0,applications:a.length,newApplications:applicationsByStatus.new||0},byStatus,byHierarchy,byTeam,initiativesByStatus,applicationsByStatus,metrics});
}
