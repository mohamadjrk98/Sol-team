import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/admin-auth';

const TEAM_OPTIONS = [
  'مكتب المؤثرات الإعلامية والتمكين البشري',
  'فريق الدراسات العامة',
  'فريق الخدمات الميدانية',
  'فريق التبرعات'
] as const;

function deny(req: Request) { return !isAdminRequest(req) ? NextResponse.json({ error: "انتهت جلسة الإدارة أو لا تملك صلاحية." }, { status: 401 }) : null; }

function cleanUsername(value: unknown) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

function internalEmail(username: string) {
  return `${username}@members.sol-team.local`;
}

export async function POST(req: Request) {
  const d = deny(req);
  if (d) return d;
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase غير متصل.' }, { status: 500 });

  const body = await req.json();
  const username = cleanUsername(body.username);
  const password = String(body.password || '');
  const volunteerId = String(body.volunteer_id || '');
  const role = body.role === "coordinator" ? "coordinator" : "volunteer";
  const coordinatorTeams = role === "coordinator" && Array.isArray(body.coordinator_teams) ? body.coordinator_teams.map(String).filter((team: string) => TEAM_OPTIONS.includes(team as typeof TEAM_OPTIONS[number])) : [];

  if (username.length < 3) return NextResponse.json({ error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل.' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' }, { status: 400 });
  if (role === 'coordinator' && coordinatorTeams.length === 0) return NextResponse.json({ error: 'يجب اختيار فريق واحد على الأقل للمنسق.' }, { status: 400 });
  if (!volunteerId) return NextResponse.json({ error: 'المتطوع مطلوب.' }, { status: 400 });

  const { data: volunteer, error: volunteerError } = await supabaseAdmin
    .from('volunteers')
    .select('id')
    .eq('id', volunteerId)
    .maybeSingle();

  if (volunteerError) return NextResponse.json({ error: volunteerError.message }, { status: 500 });
  if (!volunteer) {
    return NextResponse.json({ error: 'المتطوع غير موجود.' }, { status: 404 });
  }

  const { data: existingAccount, error: existingAccountError } = await supabaseAdmin
    .from('volunteer_accounts')
    .select('user_id')
    .eq('volunteer_id', volunteerId)
    .maybeSingle();

  if (existingAccountError) return NextResponse.json({ error: existingAccountError.message }, { status: 500 });
  if (existingAccount) {
    return NextResponse.json({ error: 'يوجد حساب دخول لهذا المتطوع مسبقاً.' }, { status: 409 });
  }

  const { data: created, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: internalEmail(username),
    password,
    email_confirm: true
  });

  if (authError || !created.user) return NextResponse.json({ error: authError?.message || 'تعذر إنشاء الحساب.' }, { status: 400 });

  const { error: linkError } = await supabaseAdmin.from('volunteer_accounts').insert({
    user_id: created.user.id,
    volunteer_id: volunteerId,
    username,
    role,
    coordinator_teams: coordinatorTeams,
  });

  if (linkError) {
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: linkError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, username });
}

export async function GET(req: Request) {
  const d = deny(req);
  if (d) return d;
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase غير متصل.' }, { status: 500 });

  const volunteerId = new URL(req.url).searchParams.get('volunteer_id');
  if (!volunteerId) return NextResponse.json({ error: 'المتطوع مطلوب.' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('volunteer_accounts')
    .select('user_id,username,role,coordinator_teams,active,created_at')
    .eq('volunteer_id', volunteerId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ account: data || null });
}
