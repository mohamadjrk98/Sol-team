import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const BUCKET = 'volunteer-photos';

function assertAdmin(password: FormDataEntryValue | null) {
  return Boolean(process.env.ADMIN_PASSWORD && String(password || '') === process.env.ADMIN_PASSWORD);
}

function safeName(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
}

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'لم يتم ضبط SUPABASE_SERVICE_ROLE_KEY أو NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 });
  }

  const form = await req.formData();
  if (!assertAdmin(form.get('password'))) {
    return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'لم يتم اختيار صورة.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WEBP فقط.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'حجم الصورة يجب ألا يتجاوز 2MB.' }, { status: 400 });
  }

  const slug = String(form.get('slug') || 'volunteer').trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF-]+/g, '-').replace(/^-+|-+$/g, '') || 'volunteer';
  const path = `${slug}/${safeName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: true
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl, path });
}
