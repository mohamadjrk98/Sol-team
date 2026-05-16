import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function passwordFrom(req: Request, body?: any) {
  const url = new URL(req.url);
  return req.headers.get('x-admin-password') || url.searchParams.get('password') || body?.password || '';
}
function assertAdmin(req: Request, body?: any) {
  return Boolean(process.env.ADMIN_PASSWORD && passwordFrom(req, body) === process.env.ADMIN_PASSWORD);
}

export async function GET(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });
  const { data, error } = await supabaseAdmin.from('join_applications').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data || [] });
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!assertAdmin(req, body)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });
  const id = String(body.id || '');
  const status = String(body.status || 'new');
  const admin_notes = String(body.admin_notes || '');
  if (!id) return NextResponse.json({ error: 'ID مطلوب.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('join_applications').update({ status, admin_notes }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID مطلوب للحذف.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('join_applications').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
