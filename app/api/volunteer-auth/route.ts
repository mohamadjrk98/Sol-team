import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

function hashPassword(password: string, salt: string) {
  return crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

function publicAccount(row: any) {
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    volunteer_slug: row.volunteer_slug,
    status: row.status,
    created_at: row.created_at,
    approved_at: row.approved_at
  };
}

export async function POST(req: Request) {
  const body = await req.json();
  const action = String(body.action || 'login');
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !email.includes('@')) return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني صحيح.' }, { status: 400 });
  if (!password || password.length < 6) return NextResponse.json({ error: 'كلمة المرور يجب ألا تقل عن 6 أحرف.' }, { status: 400 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'إعدادات الخادم غير مكتملة. تأكد من SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 });

  if (action === 'signup') {
    const full_name = String(body.full_name || '').trim();
    const phone = String(body.phone || '').trim();
    const volunteer_slug = String(body.volunteer_slug || '').trim() || null;
    if (!full_name) return NextResponse.json({ error: 'يرجى إدخال الاسم الكامل.' }, { status: 400 });
    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = hashPassword(password, salt);
    const { data, error } = await supabaseAdmin
      .from('volunteer_accounts')
      .insert({ full_name, email, phone, volunteer_slug, password_hash, password_salt: salt, status: 'pending' })
      .select('*')
      .single();
    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'هذا البريد مسجل مسبقاً. جرّب تسجيل الدخول أو تواصل مع الإدارة.' }, { status: 409 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, account: publicAccount(data), message: 'تم إنشاء الحساب. بانتظار موافقة الإدارة قبل الدخول.' });
  }

  const { data, error } = await supabaseAdmin.from('volunteer_accounts').select('*').eq('email', email).single();
  if (error || !data) return NextResponse.json({ error: 'بيانات الدخول غير صحيحة.' }, { status: 401 });
  const hash = hashPassword(password, data.password_salt || '');
  if (hash !== data.password_hash) return NextResponse.json({ error: 'بيانات الدخول غير صحيحة.' }, { status: 401 });
  if (data.status !== 'approved') {
    return NextResponse.json({ ok: true, pending: true, account: publicAccount(data), message: 'حسابك بانتظار تأكيد الإدارة.' });
  }
  await supabaseAdmin.from('volunteer_accounts').update({ last_login_at: new Date().toISOString() }).eq('id', data.id);
  return NextResponse.json({ ok: true, account: publicAccount(data), message: 'تم تسجيل الدخول بنجاح.' });
}
