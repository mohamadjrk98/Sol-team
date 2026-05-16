import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ results: [] });
  const { data, error } = await supabaseAdmin
    .from('weekly_star_votes')
    .select('volunteer_slug')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
  if (error) return NextResponse.json({ results: [] });
  const counts: Record<string, number> = {};
  for (const row of data || []) counts[row.volunteer_slug] = (counts[row.volunteer_slug] || 0) + 1;
  return NextResponse.json({ results: Object.entries(counts).map(([volunteer_slug, votes]) => ({ volunteer_slug, votes })) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const volunteer_slug = String(body.volunteer_slug || '').trim();
  const voter_name = String(body.voter_name || '').trim() || null;
  if (!volunteer_slug) return NextResponse.json({ error: 'يرجى اختيار متطوع.' }, { status: 400 });
  if (!supabaseAdmin) return NextResponse.json({ ok: true });
  const { error } = await supabaseAdmin.from('weekly_star_votes').insert({ volunteer_slug, voter_name });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
