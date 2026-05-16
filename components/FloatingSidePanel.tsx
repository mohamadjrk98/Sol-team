'use client';

import Link from 'next/link';
import { CalendarDays, ChevronLeft, Sparkles, Star } from 'lucide-react';

export default function FloatingSidePanel() {
  return (
    <aside className="floating-side-panel" aria-label="روابط جانبية لفريق أبناء الأرض">
      <Link href="/star-vote" className="side-panel-card vote-card">
        <span className="side-icon"><Star size={20} /></span>
        <span>
          <strong>صوّت لنجم الأسبوع</strong>
          <small>في فريق أبناء الأرض</small>
        </span>
        <ChevronLeft size={18} />
      </Link>

      <div className="side-panel-card dates-card">
        <span className="side-icon"><CalendarDays size={20} /></span>
        <span>
          <strong>مواعيد هامة</strong>
          <small>الاجتماع العام: الخميس الساعة 5</small>
        </span>
      </div>

      <Link href="/volunteer-login" className="side-panel-card login-card">
        <span className="side-icon"><Sparkles size={20} /></span>
        <span>
          <strong>دخول المتطوعين</strong>
          <small>حسابك ينتظر موافقة الإدارة</small>
        </span>
        <ChevronLeft size={18} />
      </Link>
    </aside>
  );
}
