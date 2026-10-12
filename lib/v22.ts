import {supabaseAdmin} from '@/lib/supabase';
export const noDb={error:'V22 tables unavailable. Apply the SQL migration in Supabase first.'};
export async function v22Table(table:'sol_events'|'sol_event_signups'|'sol_attendance'|'sol_certificates'){
 if(!supabaseAdmin)throw Error('Supabase service role is not configured');
 return supabaseAdmin.from(table);
}
export function validText(v:unknown,max=200){return typeof v==='string'?v.trim().slice(0,max):''}
export function apiError(error:any){return error?.code==='42P01'?'V22 database tables are not installed. Apply the migration first.':(error?.message||'Database error')}
