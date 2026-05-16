import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function assertAdmin(req: Request) {
  const url = new URL(req.url);
  const password = req.headers.get('x-admin-password') || url.searchParams.get('password') || '';
  return Boolean(process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);
}

export async function GET(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'كلمة مرور الإدارة غير صحيحة.' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'لم يتم ضبط مفاتيح Supabase الخاصة بالإدارة.' }, { status: 500 });

  const [volunteersRes, initiativesRes, applicationsRes, metricsRes] = await Promise.all([
    supabaseAdmin.from('volunteers').select('volunteer_status,hierarchy_level,team_name,created_at'),
    supabaseAdmin.from('initiatives').select('status,category,team,date'),
    supabaseAdmin.from('join_applications').select('status,preferred_team,created_at'),
    supabaseAdmin.from('impact_metrics').select('label,value,suffix,description')
  ]);

  if (volunteersRes.error) return NextResponse.json({ error: volunteersRes.error.message }, { status: 500 });

  const volunteers = volunteersRes.data || [];
  const initiatives = initiativesRes.data || [];
  const applications = applicationsRes.data || [];
  const metrics = metricsRes.data || [];

  const byStatus = volunteers.reduce((acc: Record<string, number>, item: any) => {
    const key = item.volunteer_status || 'active';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byHierarchy = volunteers.reduce((acc: Record<string, number>, item: any) => {
    const key = item.hierarchy_level || 'volunteer';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byTeam = volunteers.reduce((acc: Record<string, number>, item: any) => {
    const key = item.team_name || 'غير محدد';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const initiativesByStatus = initiatives.reduce((acc: Record<string, number>, item: any) => {
    const key = item.status || 'planned';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const applicationsByStatus = applications.reduce((acc: Record<string, number>, item: any) => {
    const key = item.status || 'new';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totals: {
      volunteers: volunteers.length,
      activeVolunteers: byStatus.active || 0,
      initiatives: initiatives.length,
      inProgressInitiatives: initiativesByStatus.in_progress || 0,
      applications: applications.length,
      newApplications: applicationsByStatus.new || 0
    },
    byStatus,
    byHierarchy,
    byTeam,
    initiativesByStatus,
    applicationsByStatus,
    metrics
  });
}
