import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function passwordFrom(req: Request, body?: any) {
  const url = new URL(req.url);
  return req.headers.get('x-admin-password') || url.searchParams.get('password') || body?.password || '';
}
function assertAdmin(req: Request, body?: any) {
  return Boolean(process.env.ADMIN_PASSWORD && passwordFrom(req, body) === process.env.ADMIN_PASSWORD);
}
function makeSlug(value: string) {
  return value.trim().toLowerCase().replace(/[\u064B-\u0652]/g, '').replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-+|-+$/g, '');
}
function payloadFrom(body: any) {
  const title = String(body.title || '').trim();
  return {
    slug: String(body.slug || '').trim() || makeSlug(title),
    title,
    excerpt: String(body.excerpt || '').trim(),
    content: String(body.content || '').trim(),
    status: String(body.status || 'planned'),
    category: String(body.category || 'مجتمعية'),
    date: body.date || new Date().toISOString().slice(0, 10),
    location: String(body.location || 'مصياف').trim(),
    image_url: String(body.image_url || '/team-banner.jpg').trim(),
    team: String(body.team || '').trim(),
    beneficiaries_count: Number(body.beneficiaries_count || 0),
    volunteer_hours: Number(body.volunteer_hours || 0),
    progress_percent: Math.max(0, Math.min(100, Number(body.progress_percent || 0))),
    is_featured: body.is_featured === true || body.is_featured === 'true'
  };
}

export async function GET(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });
  const { data, error } = await supabaseAdmin.from('initiatives').select('*').order('date', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ initiatives: data || [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!assertAdmin(req, body)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });
  const payload = payloadFrom(body);
  if (!payload.title || !payload.slug) return NextResponse.json({ error: 'عنوان المبادرة مطلوب.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('initiatives').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug: payload.slug });
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!assertAdmin(req, body)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });
  const payload = payloadFrom(body);
  if (!payload.title || !payload.slug) return NextResponse.json({ error: 'عنوان المبادرة مطلوب.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('initiatives').upsert(payload, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug: payload.slug });
}

export async function DELETE(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug مطلوب للحذف.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('initiatives').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
