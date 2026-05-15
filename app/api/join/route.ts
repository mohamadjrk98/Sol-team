import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || '').trim().toLowerCase();
  const full_name = String(body.full_name || '').trim() || null;
  const phone = String(body.phone || '').trim() || null;
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني صحيح.' }, { status: 400 });
  if (!supabase) return NextResponse.json({ ok: true });
  const { error } = await supabase.from('training_waitlist').upsert({ email, full_name, phone }, { onConflict: 'email' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
