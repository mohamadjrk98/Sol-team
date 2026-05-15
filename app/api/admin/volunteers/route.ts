import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function split(value: unknown) {
  if (Array.isArray(value)) return value.map(String).map(x => x.trim()).filter(Boolean);
  return String(value || '').split(/[،,\n]/).map((x) => x.trim()).filter(Boolean);
}
function numberOrNull(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function passwordFrom(req: Request, body?: any) {
  const url = new URL(req.url);
  return req.headers.get('x-admin-password') || url.searchParams.get('password') || body?.password || '';
}
function assertAdmin(req: Request, body?: any) {
  return Boolean(process.env.ADMIN_PASSWORD && passwordFrom(req, body) === process.env.ADMIN_PASSWORD);
}
function payloadFrom(body: any) {
  return {
    slug: String(body.slug || '').trim().toLowerCase().replace(/\s+/g, '-'),
    full_name: String(body.full_name || '').trim(),
    role: body.role || null,
    hierarchy_level: body.hierarchy_level || 'volunteer',
    department: body.department || null,
    team_name: body.team_name || null,
    position_rank: numberOrNull(body.position_rank) ?? 100,
    specialization: body.specialization || null,
    joined_year: numberOrNull(body.joined_year),
    joined_date: body.joined_date || null,
    location: body.location || null,
    age: numberOrNull(body.age),
    avatar_url: body.avatar_url || null,
    bio: body.bio || null,
    motivation: body.motivation || null,
    skills: split(body.skills),
    achievements: split(body.achievements),
    works: split(body.works),
    certificates: split(body.certificates),
    social_links: body.social_links || {},
    volunteer_status: body.volunteer_status || 'active',
    exit_reason: body.exit_reason || null,
    is_featured: body.is_featured === 'true' || body.is_featured === true
  };
}

export async function GET(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط SUPABASE_SERVICE_ROLE_KEY أو NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 });
  const { data, error } = await supabaseAdmin.from('volunteers').select('*').order('position_rank', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ volunteers: data || [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!assertAdmin(req, body)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط SUPABASE_SERVICE_ROLE_KEY أو NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 });
  const payload = payloadFrom(body);
  if (!payload.slug || !payload.full_name) return NextResponse.json({ error: 'الاسم والـ slug مطلوبان.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('volunteers').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug: payload.slug });
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!assertAdmin(req, body)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط SUPABASE_SERVICE_ROLE_KEY أو NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 });
  const payload = payloadFrom(body);
  if (!payload.slug || !payload.full_name) return NextResponse.json({ error: 'الاسم والـ slug مطلوبان.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('volunteers').upsert(payload, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug: payload.slug });
}

export async function DELETE(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط SUPABASE_SERVICE_ROLE_KEY أو NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 });
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'الـ slug مطلوب للحذف.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('volunteers').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
