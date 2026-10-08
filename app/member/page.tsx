'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

type MemberAccount = {
  user_id: string;
  volunteer_id: string;
  username: string;
  role: 'volunteer' | 'coordinator';
  coordinator_teams: string[];
  active: boolean;
};

type MemberVolunteer = {
  id: string;
  slug: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  team_name: string | null;
  team_names: string[];
  certificates: string[];
};

type VolunteerHour = {
  id: string;
  volunteer_id: string;
  team_name: string;
  work_date: string;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type CoordinatorHour = VolunteerHour & {
  volunteer_name: string;
};

export default function MemberPage() {
  const router = useRouter();
  const [account, setAccount] = useState<MemberAccount | null>(null);
  const [volunteer, setVolunteer] = useState<MemberVolunteer | null>(null);
  const [hours, setHours] = useState<VolunteerHour[]>([]);
  const [coordinatorHours, setCoordinatorHours] = useState<CoordinatorHour[]>([]);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [workTeam, setWorkTeam] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);


  async function loadMember() {
    if (!supabase) {
      setError('خدمة الحسابات غير متاحة حالياً.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace('/member/login');
      return;
    }

    const { data: accountData, error: accountError } = await supabase
      .from('volunteer_accounts')
      .select('user_id,volunteer_id,username,role,coordinator_teams,active')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (accountError || !accountData || !accountData.active) {
      await supabase.auth.signOut();
      router.replace('/member/login');
      return;
    }

    const { data: volunteerData, error: volunteerError } = await supabase
      .from('volunteers')
      .select('id,slug,full_name,role,avatar_url,team_name,team_names,certificates')
      .eq('id', accountData.volunteer_id)
      .maybeSingle();

    if (volunteerError || !volunteerData) {
      setError('تعذر تحميل بيانات المتطوع.');
      setLoading(false);
      return;
    }

    const { data: hoursData, error: hoursError } = await supabase
      .from('volunteer_hours')
      .select('id,volunteer_id,team_name,work_date,hours,description,status,rejection_reason,reviewed_at,created_at')
      .eq('volunteer_id', accountData.volunteer_id)
      .order('created_at', { ascending: false });

    if (hoursError) {
      setError('تعذر تحميل سجل الساعات.');
      setLoading(false);
      return;
    }

    setAccount(accountData as MemberAccount);
    setVolunteer(volunteerData as MemberVolunteer);
    setHours((hoursData || []) as VolunteerHour[]);
    setCoordinatorHours([]);

    if (
      accountData.role === 'coordinator' &&
      accountData.coordinator_teams?.length
    ) {
      const { data: pendingData, error: pendingError } = await supabase
        .from('volunteer_hours')
        .select('id,volunteer_id,team_name,work_date,hours,description,status,rejection_reason,reviewed_at,created_at')
        .in('team_name', accountData.coordinator_teams)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (pendingError) {
        setError('تعذر تحميل طلبات الساعات المعلقة.');
        setLoading(false);
        return;
      }

      const volunteerIds = Array.from(
        new Set((pendingData || []).map(item => item.volunteer_id))
      );

      let names: Record<string, string> = {};

      if (volunteerIds.length) {
        const { data: peopleData, error: peopleError } = await supabase
          .from('volunteers')
          .select('id,full_name')
          .in('id', volunteerIds);

        if (peopleError) {
          setError('تعذر تحميل أسماء أصحاب الطلبات.');
          setLoading(false);
          return;
        }

        names = Object.fromEntries(
          (peopleData || []).map(person => [person.id, person.full_name])
        );
      }

      setCoordinatorHours(
        (pendingData || []).map(item => ({
          ...(item as VolunteerHour),
          volunteer_name: names[item.volunteer_id] || 'متطوع'
        }))
      );
    }

    const teams = (volunteerData.team_names?.length
      ? volunteerData.team_names
      : (volunteerData.team_name ? [volunteerData.team_name] : [])) as string[];

    setWorkTeam(current => current || teams[0] || '');
    setLoading(false);
  }

  async function submitHours(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase || !account || !volunteer) return;

    const amount = Number(workHours);

    const teams = volunteer.team_names?.length
      ? volunteer.team_names
      : (volunteer.team_name ? [volunteer.team_name] : []);

    if (!workTeam || !teams.includes(workTeam)) {
      return setError('اختر الفريق الذي استفاد من ساعات العمل.');
    }

    if (!workDate) return setError('اختر تاريخ العمل.');
    if (!Number.isFinite(amount) || amount <= 0 || amount > 24) {
      return setError('عدد الساعات يجب أن يكون أكبر من صفر ولا يتجاوز 24 ساعة.');
    }

    if (!description.trim()) {
      return setError('اكتب وصفاً مختصراً للعمل المنجز.');
    }

    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase
      .from('volunteer_hours')
      .insert({
        volunteer_id: account.volunteer_id,
        team_name: workTeam,
        work_date: workDate,
        hours: amount,
        description: description.trim()
      });

    setSubmitting(false);

    if (insertError) {
      return setError('تعذر تسجيل الساعات. حاول مرة أخرى.');
    }

    setWorkHours('');
    setDescription('');
    await loadMember();
  }

  async function reviewHour(
    id: string,
    status: 'approved' | 'rejected',
    rejectionReason: string | null = null
  ) {
    if (!supabase || !account || account.role !== 'coordinator') return;

    if (status === 'rejected' && !rejectionReason?.trim()) {
      return setError('يجب كتابة سبب رفض الطلب.');
    }

    setReviewingId(id);
    setError('');

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setReviewingId(null);
      router.replace('/member/login');
      return;
    }

    const { error: reviewError } = await supabase
      .from('volunteer_hours')
      .update({
        status,
        reviewed_by: authData.user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason:
          status === 'rejected' ? rejectionReason!.trim() : null
      })
      .eq('id', id)
      .eq('status', 'pending');

    setReviewingId(null);

    if (reviewError) {
      return setError('تعذر تحديث حالة الطلب.');
    }

    await loadMember();
  }

  useEffect(() => {
    loadMember();
  }, []);

  const approvedHours = useMemo(
    () => hours
      .filter(item => item.status === 'approved')
      .reduce((sum, item) => sum + Number(item.hours), 0),
    [hours]
  );

  const pendingHours = useMemo(
    () => hours
      .filter(item => item.status === 'pending')
      .reduce((sum, item) => sum + Number(item.hours), 0),
    [hours]
  );

  const memberTeams = volunteer
    ? (volunteer.team_names?.length
        ? volunteer.team_names
        : (volunteer.team_name ? [volunteer.team_name] : []))
    : [];

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    router.replace('/member/login');
  }

  if (loading) {
    return (
      <main className="admin-shell">
        <section className="section">
          <div className="container">
            <p>جاري تحميل حسابك...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="card">
            <div className="form-title">
              <div>
                <span className="eyebrow">لوحة المتطوع</span>
                <h1>أهلاً وسهلاً، {volunteer?.full_name} 👋</h1>
                <p className="muted">سعداء بوجودك ضمن فريق أبناء الأرض التطوعي، وشكراً للأثر الذي تصنعه معنا.</p>
              </div>
              <button className="btn btn-secondary" type="button" onClick={logout}>
                تسجيل الخروج
              </button>
            </div>

            {error && <p className="error">{error}</p>}

            {volunteer && (
              <div className="card dashboard-member-card">
                <img
                  className="dashboard-member-photo"
                  src={volunteer.avatar_url || '/avatar.svg'}
                  alt={volunteer.full_name}
                />

                <div className="dashboard-member-info">
                  <span className="eyebrow">بطاقة المتطوع</span>
                  <h2>{volunteer.full_name}</h2>

                  <p><strong>المنصب:</strong> {volunteer.role || 'متطوع'}</p>
                  <p><strong>الفريق:</strong> {memberTeams.join(' • ') || 'غير محدد'}</p>

                  {volunteer.certificates?.length > 0 && (
                    <div className="dashboard-member-certificates">
                      <strong>الشهادات:</strong>
                      <div className="pill-row">
                        {volunteer.certificates.map((certificate, index) => (
                          <span className="pill" key={`${certificate}-${index}`}>
                            {certificate}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="dashboard-member-qr">
                  <div className="dashboard-member-qr-box">
                    <QRCodeSVG
                      value={`${window.location.origin}/volunteers/${volunteer.slug}`}
                      size={100}
                    />
                  </div>
                  <p className="muted">امسح الرمز لعرض معلومات المتطوع</p>

                  <a
                    className="member-my-id-btn"
                    href={`/volunteers/${volunteer.slug}/card`}
                  >
                    <span className="member-my-id-title">MY ID</span>
                    <span className="member-my-id-subtitle">عرض بطاقتك التعريفية التطوعية</span>
                  </a>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 20 }}>
              <div className="card" style={{ flex: 1, minWidth: 180 }}>
                <strong>الساعات المعتمدة</strong>
                <h2>{approvedHours}</h2>
              </div>
              <div className="card" style={{ flex: 1, minWidth: 180 }}>
                <strong>قيد المراجعة</strong>
                <h2>{pendingHours}</h2>
              </div>
            </div>
          </div>

          <form className="card admin-form luxury-form" onSubmit={submitHours} style={{ marginTop: 20 }}>
            <div className="form-title">
              <div>
                <span className="eyebrow">تسجيل عمل تطوعي</span>
                <h2>إضافة ساعات</h2>
              </div>
            </div>

            <label className="label">
              الفريق المستفيد
              <select
                className="input"
                value={workTeam}
                onChange={e => setWorkTeam(e.target.value)}
                required
              >
                <option value="">اختر الفريق</option>
                {memberTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </label>

            <label className="label">
              تاريخ العمل
              <input
                className="input"
                type="date"
                value={workDate}
                onChange={e => setWorkDate(e.target.value)}
                required
              />
            </label>

            <label className="label">
              عدد الساعات
              <input
                className="input"
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                value={workHours}
                onChange={e => setWorkHours(e.target.value)}
                required
              />
            </label>

            <label className="label">
              وصف العمل المنجز
              <textarea
                className="input"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </label>

            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'جاري الإرسال...' : 'إرسال للمراجعة'}
            </button>
          </form>

          {account?.role === 'coordinator' && (
            <div className="card" style={{ marginTop: 20 }}>
              <div className="form-title">
                <div>
                  <span className="eyebrow">إدارة الساعات</span>
                  <h2>طلبات بانتظار المراجعة</h2>
                  <p className="muted">
                    تظهر هنا طلبات الفرق المسؤول عنها فقط.
                  </p>
                </div>
              </div>

              {coordinatorHours.length === 0 ? (
                <p className="muted">لا توجد طلبات معلقة حالياً.</p>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {coordinatorHours.map(item => (
                    <div className="card" key={item.id}>
                      <h3>{item.volunteer_name}</h3>
                      <p><strong>{item.hours} ساعة</strong></p>
                      <p>{item.description}</p>
                      <p className="muted">
                        {item.team_name} — {item.work_date}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          flexWrap: 'wrap',
                          marginTop: 12
                        }}
                      >
                        <button
                          className="btn"
                          type="button"
                          disabled={reviewingId === item.id}
                          onClick={() => reviewHour(item.id, 'approved')}
                        >
                          {reviewingId === item.id ? 'جاري الحفظ...' : 'قبول الساعات'}
                        </button>

                        <button
                          className="btn btn-secondary"
                          type="button"
                          disabled={reviewingId === item.id}
                          onClick={() => {
                            const reason = window.prompt('اكتب سبب رفض الطلب:');
                            if (reason?.trim()) {
                              reviewHour(item.id, 'rejected', reason);
                            }
                          }}
                        >
                          رفض الطلب
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card" style={{ marginTop: 20 }}>
            <div className="form-title">
              <div>
                <span className="eyebrow">السجل</span>
                <h2>ساعاتي التطوعية</h2>
              </div>
            </div>

            {hours.length === 0 ? (
              <p className="muted">لا توجد ساعات مسجلة حتى الآن.</p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {hours.map(item => (
                  <div className="card" key={item.id}>
                    <strong>{item.hours} ساعة</strong>
                    <p>{item.description}</p>
                    <p className="muted">{item.team_name} — {item.work_date}</p>
                    <p>
                      الحالة:{' '}
                      <strong>
                        {item.status === 'approved'
                          ? 'مقبولة'
                          : item.status === 'rejected'
                            ? 'مرفوضة'
                            : 'قيد المراجعة'}
                      </strong>
                    </p>
                    {item.status === 'rejected' && item.rejection_reason && (
                      <p className="error">سبب الرفض: {item.rejection_reason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
