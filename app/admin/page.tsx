'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type VolunteerRow = {
  id?: string;
  slug: string;
  full_name: string;
  role: string;
  hierarchy_level: string;
  department: string;
  team_name: string;
  position_rank: number | null;
  specialization: string;
  joined_year: number | null;
  joined_date?: string | null;
  location: string;
  age: number | null;
  avatar_url: string;
  bio: string;
  motivation: string;
  skills: string[];
  achievements: string[];
  works: string[];
  certificates: string[];
  volunteer_status?: string;
  exit_reason?: string;
  is_featured: boolean;
};

const emptyVolunteer: VolunteerRow = {
  slug: '', full_name: '', role: '', hierarchy_level: 'volunteer', department: 'المتطوعون', team_name: '', position_rank: 30,
  specialization: '', joined_year: new Date().getFullYear(), joined_date: '', location: 'مصياف - سوريا', age: null, avatar_url: '', bio: '', motivation: '',
  skills: [], achievements: [], works: [], certificates: [], volunteer_status: 'active', exit_reason: '', is_featured: false
};

const statusLabels: Record<string, string> = { active: 'نشط', left: 'غادر', dismissed: 'تم فصله', vacation: 'إجازة', paused: 'معلّق' };
const statusClasses: Record<string, string> = { active: 'green', left: 'gray', dismissed: 'red', vacation: 'yellow', paused: 'orange' };

function arrToText(items?: string[]) { return (items || []).join('\n'); }
function textToArr(value: FormDataEntryValue | null) { return String(value || '').split(/[\n،,]/).map(v => v.trim()).filter(Boolean); }
function num(value: FormDataEntryValue | null) { const n = Number(value); return Number.isFinite(n) && n > 0 ? n : null; }
function makeSlug(name: string) { return name.trim().toLowerCase().replace(/[\u064B-\u0652]/g, '').replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-+|-+$/g, ''); }

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [volunteers, setVolunteers] = useState<VolunteerRow[]>([]);
  const [selected, setSelected] = useState<VolunteerRow>(emptyVolunteer);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => volunteers.filter(v => [v.full_name, v.role, v.department, v.team_name, statusLabels[v.volunteer_status || 'active']].join(' ').includes(query)), [volunteers, query]);

  async function loadVolunteers() {
    if (!password) return setError('أدخل كلمة مرور الإدارة أولاً.');
    setError(''); setStatus(''); setLoading(true);
    const res = await fetch('/api/admin/volunteers', { headers: { 'x-admin-password': password } });
    const json = await res.json(); setLoading(false);
    if (!res.ok) return setError(json.error || 'تعذر تحميل البيانات.');
    setVolunteers(json.volunteers || []);
    setStatus('تم تحميل بيانات المتطوعين.');
  }

  useEffect(() => { if (selected.full_name && !selected.slug) setSelected(s => ({ ...s, slug: makeSlug(s.full_name) })); }, [selected.full_name, selected.slug]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus(''); setError(''); setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      password,
      slug: String(form.get('slug') || '').trim() || makeSlug(String(form.get('full_name') || '')),
      full_name: String(form.get('full_name') || '').trim(),
      role: String(form.get('role') || '').trim(),
      hierarchy_level: String(form.get('hierarchy_level') || 'volunteer'),
      department: String(form.get('department') || ''),
      team_name: String(form.get('team_name') || ''),
      position_rank: num(form.get('position_rank')),
      specialization: String(form.get('specialization') || ''),
      joined_year: num(form.get('joined_year')),
      joined_date: String(form.get('joined_date') || '') || null,
      location: String(form.get('location') || ''),
      age: num(form.get('age')),
      avatar_url: String(form.get('avatar_url') || ''),
      bio: String(form.get('bio') || ''),
      motivation: String(form.get('motivation') || ''),
      skills: textToArr(form.get('skills')),
      achievements: textToArr(form.get('achievements')),
      works: textToArr(form.get('works')),
      certificates: textToArr(form.get('certificates')),
      volunteer_status: String(form.get('volunteer_status') || 'active'),
      exit_reason: String(form.get('exit_reason') || ''),
      is_featured: form.get('is_featured') === 'true'
    };
    const method = volunteers.some(v => v.slug === selected.slug) ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/volunteers', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await res.json(); setLoading(false);
    if (!res.ok) return setError(json.error || 'حدث خطأ أثناء الحفظ.');
    setStatus('تم حفظ البيانات بنجاح.');
    setSelected(emptyVolunteer);
    await loadVolunteers();
  }

  async function remove(slug: string) {
    if (!confirm('هل أنت متأكد من حذف هذه البطاقة؟')) return;
    setLoading(true); setError(''); setStatus('');
    const res = await fetch(`/api/admin/volunteers?slug=${encodeURIComponent(slug)}&password=${encodeURIComponent(password)}`, { method: 'DELETE' });
    const json = await res.json(); setLoading(false);
    if (!res.ok) return setError(json.error || 'تعذر الحذف.');
    setStatus('تم حذف المتطوع.');
    setSelected(emptyVolunteer);
    await loadVolunteers();
  }

  return <main className="admin-shell">
    <section className="admin-hero">
      <div className="container admin-hero-grid">
        <div>
          <span className="eyebrow">لوحة التحكم الخاصة بالإدارة</span>
          <h1>إدارة المتطوعين والهيكل التنظيمي</h1>
          <p className="lead small">إضافة، تعديل، حذف، وحفظ بيانات الإدارة والمنسقين والمتطوعين مع بطاقة فاخرة منسجمة مع هوية فريق أبناء الأرض التطوعي.</p>
        </div>
        <div className="admin-login-card">
          <label className="label">كلمة مرور الإدارة
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="ADMIN_PASSWORD" />
          </label>
          <button className="btn yellow" onClick={loadVolunteers} disabled={loading}>{loading ? 'جاري التحميل...' : 'تحميل البيانات'}</button>
          <p className="muted">اضبط ADMIN_PASSWORD و SUPABASE_SERVICE_ROLE_KEY داخل Vercel لحماية العمليات.</p>
        </div>
      </div>
    </section>

    <section className="section"><div className="container admin-grid">
      <aside className="card admin-list-card">
        <div className="section-head"><div><h2>السجلات</h2><p className="muted">اختر بطاقة لتعديلها أو أنشئ بطاقة جديدة.</p></div></div>
        <input className="input" placeholder="بحث بالاسم أو المنصب أو الحالة..." value={query} onChange={e => setQuery(e.target.value)} />
        <button className="btn secondary" onClick={() => setSelected(emptyVolunteer)} style={{ width: '100%', marginTop: 12 }}>+ بطاقة جديدة</button>
        <div className="admin-vol-list">
          {filtered.map(v => <button key={v.slug} className="admin-vol-item" onClick={() => setSelected({ ...emptyVolunteer, ...v })}>
            <img src={v.avatar_url || '/avatar.svg'} alt="" />
            <span><strong>{v.full_name}</strong><small>{v.role || 'بدون منصب'} — {v.team_name || v.department}</small></span>
            <em className={`status-badge ${statusClasses[v.volunteer_status || 'active']}`}>{statusLabels[v.volunteer_status || 'active']}</em>
          </button>)}
        </div>
      </aside>

      <form className="card admin-form luxury-form" onSubmit={submit}>
        {status && <p className="success">{status}</p>}{error && <p className="error">{error}</p>}
        <div className="form-title"><h2>{selected.slug ? 'تعديل بطاقة' : 'إنشاء بطاقة'} المتطوع</h2>{selected.slug && <button type="button" className="danger-btn" onClick={() => remove(selected.slug)}>حذف</button>}</div>
        <div className="form-grid">
          <label className="label">الاسم الكامل<input className="input" name="full_name" required value={selected.full_name} onChange={e => setSelected({...selected, full_name:e.target.value})}/></label>
          <label className="label">Slug<input className="input" name="slug" required value={selected.slug} onChange={e => setSelected({...selected, slug:e.target.value})}/></label>
          <label className="label">المنصب / المهمة<input className="input" name="role" value={selected.role || ''} onChange={e => setSelected({...selected, role:e.target.value})} placeholder="رئيس مجلس إدارة / منسق / متطوع"/></label>
          <label className="label">الحالة<select className="input" name="volunteer_status" value={selected.volunteer_status || 'active'} onChange={e => setSelected({...selected, volunteer_status:e.target.value})}><option value="active">نشط</option><option value="vacation">إجازة</option><option value="paused">معلّق</option><option value="left">غادر</option><option value="dismissed">تم فصله</option></select></label>
          <label className="label">المستوى التنظيمي<select className="input" name="hierarchy_level" value={selected.hierarchy_level} onChange={e => setSelected({...selected, hierarchy_level:e.target.value})}><option value="board">إدارة</option><option value="coordinator">منسق</option><option value="volunteer">متطوع</option></select></label>
          <label className="label">القسم<select className="input" name="department" value={selected.department || ''} onChange={e => setSelected({...selected, department:e.target.value})}><option>الإدارة</option><option>المنسقون</option><option>المتطوعون</option></select></label>
          <label className="label">الفريق<select className="input" name="team_name" value={selected.team_name || ''} onChange={e => setSelected({...selected, team_name:e.target.value})}><option value="">بدون</option><option>فريق الرصد</option><option>الفريق الميداني</option><option>الفريق الإعلامي</option><option>فريق التوعية</option></select></label>
          <label className="label">ترتيب الظهور<input className="input" name="position_rank" type="number" value={selected.position_rank || ''} onChange={e => setSelected({...selected, position_rank:Number(e.target.value)})}/></label>
          <label className="label">تاريخ الانضمام<input className="input" name="joined_date" type="date" value={selected.joined_date || ''} onChange={e => setSelected({...selected, joined_date:e.target.value})}/></label>
          <label className="label">سنة الانضمام<input className="input" name="joined_year" type="number" value={selected.joined_year || ''} onChange={e => setSelected({...selected, joined_year:Number(e.target.value)})}/></label>
          <label className="label">التخصص<input className="input" name="specialization" value={selected.specialization || ''} onChange={e => setSelected({...selected, specialization:e.target.value})}/></label>
          <label className="label">العمر<input className="input" name="age" type="number" value={selected.age || ''} onChange={e => setSelected({...selected, age:Number(e.target.value)})}/></label>
          <label className="label wide">رابط الصورة الشخصية<input className="input" name="avatar_url" value={selected.avatar_url || ''} onChange={e => setSelected({...selected, avatar_url:e.target.value})} placeholder="https://..."/></label>
          <label className="label wide">الموقع<input className="input" name="location" value={selected.location || ''} onChange={e => setSelected({...selected, location:e.target.value})}/></label>
          <label className="label wide">نبذة<textarea className="textarea" name="bio" value={selected.bio || ''} onChange={e => setSelected({...selected, bio:e.target.value})}/></label>
          <label className="label wide">الدافع للتطوع<textarea className="textarea" name="motivation" value={selected.motivation || ''} onChange={e => setSelected({...selected, motivation:e.target.value})}/></label>
          <label className="label wide">الأعمال / كل سطر عمل<textarea className="textarea" name="works" value={arrToText(selected.works)} onChange={e => setSelected({...selected, works:textToArr(e.target.value)})}/></label>
          <label className="label wide">الإنجازات / كل سطر إنجاز<textarea className="textarea" name="achievements" value={arrToText(selected.achievements)} onChange={e => setSelected({...selected, achievements:textToArr(e.target.value)})}/></label>
          <label className="label wide">المهارات / كل سطر مهارة<textarea className="textarea" name="skills" value={arrToText(selected.skills)} onChange={e => setSelected({...selected, skills:textToArr(e.target.value)})}/></label>
          <label className="label wide">الشهادات / كل سطر شهادة<textarea className="textarea" name="certificates" value={arrToText(selected.certificates)} onChange={e => setSelected({...selected, certificates:textToArr(e.target.value)})}/></label>
          <label className="label wide">ملاحظات الحالة أو سبب المغادرة<textarea className="textarea" name="exit_reason" value={selected.exit_reason || ''} onChange={e => setSelected({...selected, exit_reason:e.target.value})}/></label>
        </div>
        <label className="featured-check"><input type="checkbox" name="is_featured" value="true" checked={selected.is_featured || false} onChange={e => setSelected({...selected, is_featured:e.target.checked})}/> إظهار كبطاقة بارزة</label>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'جاري الحفظ...' : 'حفظ البيانات'}</button>
      </form>
    </div></section>
  </main>;
}
