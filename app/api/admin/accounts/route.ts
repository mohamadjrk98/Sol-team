import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function checkPassword(req: Request, body?: any) {
  const header = req.headers.get('x-admin-password');
  const provided = header || body?.password || '';
  return Boolean(process.env.ADMIN_PASSWORD && provided === process.env.ADMIN_PASSWORD);
}

export async function GET(req: Request) {
  if (!checkPassword(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY غير مضبوط.' }, { status: 500 });
  const { data, error } = await supabaseAdmin.from('volunteer_accounts').select('id,full_name,email,phone,volunteer_slug,status,admin_notes,created_at,approved_at,last_login_at').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ accounts: data || [] });
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!checkPassword(req, body)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY غير مضبوط.' }, { status: 500 });
  const id = String(body.id || '');
  const status = String(body.status || 'pending');
  if (!id) return NextResponse.json({ error: 'معرّف الحساب مطلوب.' }, { status: 400 });
  const payload: any = { status, admin_notes: String(body.admin_notes || '') };
  if (status === 'approved') payload.approved_at = new Date().toISOString();
  const { error } = await supabaseAdmin.from('volunteer_accounts').update(payload).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password') || '';
  const id = searchParams.get('id') || '';
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY غير مضبوط.' }, { status: 500 });
  const { error } = await supabaseAdmin.from('volunteer_accounts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
