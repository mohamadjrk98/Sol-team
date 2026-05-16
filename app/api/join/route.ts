import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || '').trim().toLowerCase();
  const full_name = String(body.full_name || '').trim();
  const phone = String(body.phone || '').trim();
  const age = Number(body.age || 0) || null;
  const city = String(body.city || '').trim();
  const specialization = String(body.specialization || '').trim();
  const preferred_team = String(body.preferred_team || '').trim();
  const motivation = String(body.motivation || '').trim();
  const availability = String(body.availability || '').trim();
  const experience = String(body.experience || '').trim();

  if (!full_name) return NextResponse.json({ error: 'يرجى إدخال الاسم الكامل.' }, { status: 400 });
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني صحيح.' }, { status: 400 });
  if (!phone) return NextResponse.json({ error: 'يرجى إدخال رقم الهاتف.' }, { status: 400 });
  if (!motivation) return NextResponse.json({ error: 'يرجى كتابة سبب رغبتك بالتطوع.' }, { status: 400 });

  if (!supabase) return NextResponse.json({ ok: true });

  const payload = { email, full_name, phone, age, city, specialization, preferred_team, motivation, availability, experience, status: 'new' };
  const { error } = await supabase.from('join_applications').upsert(payload, { onConflict: 'email' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
