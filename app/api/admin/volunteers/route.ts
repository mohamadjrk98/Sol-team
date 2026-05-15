import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function split(value: unknown) {
  return String(value || '').split(/[،,\n]/).map((x) => x.trim()).filter(Boolean);
}
function numberOrNull(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!process.env.ADMIN_PASSWORD || body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'لم يتم ضبط SUPABASE_SERVICE_ROLE_KEY أو NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 });
  }
  const payload = {
    slug: String(body.slug || '').trim().toLowerCase().replace(/\s+/g, '-'),
    full_name: String(body.full_name || '').trim(),
    role: body.role || null,
    specialization: body.specialization || null,
    joined_year: numberOrNull(body.joined_year),
    location: body.location || null,
    age: numberOrNull(body.age),
    avatar_url: body.avatar_url || null,
    bio: body.bio || null,
    motivation: body.motivation || null,
    skills: split(body.skills),
    achievements: split(body.achievements),
    works: split(body.works),
    certificates: split(body.certificates),
    social_links: {},
    is_featured: body.is_featured === 'true' || body.is_featured === true
  };
  if (!payload.slug || !payload.full_name) return NextResponse.json({ error: 'الاسم والـ slug مطلوبان.' }, { status: 400 });
  const { error } = await supabaseAdmin.from('volunteers').upsert(payload, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug: payload.slug });
}
