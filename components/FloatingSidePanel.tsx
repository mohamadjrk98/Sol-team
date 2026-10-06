'use client';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, Sparkles, Star } from 'lucide-react';

export default function FloatingSidePanel({ meetingText = 'الاجتماع العام: الخميس الساعة 5' }: { meetingText?: string }) {
  return <aside className="floating-side-panel" aria-label="اختصارات الفريق">
    <Link href="/star-vote" className="side-panel-card vote-card"><span className="side-icon"><Star size={20}/></span><span><strong>صوّت لنجم الأسبوع</strong><small>شارك في تقدير جهود المتطوعين</small></span><ChevronLeft size={18}/></Link>
    <div className="side-panel-card dates-card"><span className="side-icon"><CalendarDays size={20}/></span><span><strong>موعد مهم</strong><small>{meetingText}</small></span></div>
    <Link href="/join" className="side-panel-card join-side-card"><span className="side-icon"><Sparkles size={20}/></span><span><strong>كن جزءاً من الأثر</strong><small>أرسل طلب انضمام بدون إنشاء حساب</small></span><ChevronLeft size={18}/></Link>
  </aside>;
}
