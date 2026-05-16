'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { BarChart3, FileText, UserPlus, Users, Activity, FolderKanban, ShieldCheck } from 'lucide-react';

const statusNames: Record<string,string> = { active:'نشط', left:'غادر', dismissed:'مفصول', vacation:'إجازة', paused:'معلّق', new:'جديد', reviewing:'قيد المراجعة', accepted:'مقبول', rejected:'مرفوض', contacted:'تم التواصل', completed:'مكتملة', in_progress:'قيد التنفيذ', planned:'مخطط' };

export default function AdminDashboardPage(){
  const [password,setPassword]=useState('');
  const [data,setData]=useState<any>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  async function load(e?:FormEvent){
    e?.preventDefault(); setError(''); setLoading(true);
    const res=await fetch('/api/admin/stats',{headers:{'x-admin-password':password}});
    const json=await res.json(); setLoading(false);
    if(!res.ok) return setError(json.error||'تعذر تحميل لوحة البيانات');
    setData(json);
  }
  const maxTeam=Math.max(1,...Object.values(data?.byTeam||{}).map(Number));
  return <main className="admin-shell"><section className="admin-hero"><div className="container admin-hero-grid"><div><span className="eyebrow">Dashboard</span><h1>لوحة مؤشرات الفريق</h1><p className="lead small">نظرة مباشرة على المتطوعين، المبادرات، وطلبات الانضمام.</p></div><form className="admin-login-card" onSubmit={load}><label className="label">كلمة مرور الإدارة<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="ADMIN_PASSWORD"/></label><button className="btn yellow" disabled={loading}>{loading?'تحميل...':'عرض المؤشرات'}</button>{error&&<p className="error">{error}</p>}</form></div></section><section className="section"><div className="container">
    <div className="admin-shortcuts"><Link href="/admin" className="card shortcut-card"><Users/><strong>إدارة المتطوعين</strong><span>إضافة وتعديل البطاقات</span></Link><Link href="/admin/initiatives" className="card shortcut-card"><FolderKanban/><strong>إدارة المبادرات</strong><span>إنشاء وتعديل المشاريع</span></Link><Link href="/admin/applications" className="card shortcut-card"><UserPlus/><strong>طلبات الانضمام</strong><span>قبول ومراجعة الطلبات</span></Link><Link href="/admin/accounts" className="card shortcut-card"><ShieldCheck/><strong>حسابات المتطوعين</strong><span>تأكيد الدخول للبوابة</span></Link></div>
    {data && <><div className="dashboard-cards"><div className="card dash-card"><Users/><span>المتطوعون</span><strong>{data.totals.volunteers}</strong><em>النشطون: {data.totals.activeVolunteers}</em></div><div className="card dash-card"><FolderKanban/><span>المبادرات</span><strong>{data.totals.initiatives}</strong><em>قيد التنفيذ: {data.totals.inProgressInitiatives}</em></div><div className="card dash-card"><UserPlus/><span>طلبات الانضمام</span><strong>{data.totals.applications}</strong><em>الجديدة: {data.totals.newApplications}</em></div><div className="card dash-card"><Activity/><span>مؤشرات الأثر</span><strong>{data.metrics.length}</strong><em>مرتبطة بقاعدة البيانات</em></div></div>
    <div className="grid two dashboard-blocks"><div className="card"><h3><BarChart3/> توزيع المتطوعين حسب الفريق</h3><div className="chart">{Object.entries(data.byTeam||{}).map(([k,v])=><div className="bar-row" key={k}><div className="bar-head"><span>{k}</span><b>{String(v)}</b></div><div className="bar-track"><div className="bar-fill" style={{width:`${Math.max(8,(Number(v)/maxTeam)*100)}%`}}/></div></div>)}</div></div><div className="card"><h3><FileText/> حالات المبادرات والطلبات</h3><div className="status-grid"><div><h4>المبادرات</h4>{Object.entries(data.initiativesByStatus||{}).map(([k,v])=><p key={k}><span className="pill">{statusNames[k]||k}</span> {String(v)}</p>)}</div><div><h4>طلبات الانضمام</h4>{Object.entries(data.applicationsByStatus||{}).map(([k,v])=><p key={k}><span className="pill yellow">{statusNames[k]||k}</span> {String(v)}</p>)}</div></div></div></div></>}
  </div></section></main>
}
