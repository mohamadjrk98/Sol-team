'use client';

import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { Volunteer } from '@/lib/types';

const statusLabels: Record<string, string> = { active: 'نشط', vacation: 'إجازة', paused: 'معلّق', left: 'غادر', dismissed: 'تم فصله' };

export default function MembershipCard({ volunteer, url }: { volunteer: Volunteer; url: string }) {
  const memberId = `SOL-${String(volunteer.position_rank || 0).padStart(3,'0')}-${volunteer.slug.slice(0, 4).toUpperCase()}`;
  return <section className="member-card-wrap">
    <div className="member-card" id="member-card-print">
      <div className="member-bg" />
      <div className="member-head">
        <Image src="/logo.png" width={58} height={58} alt="شعار أبناء الأرض" />
        <div><strong>فريق أبناء الأرض التطوعي</strong><span>بطاقة عضوية رسمية</span></div>
      </div>
      <div className="member-body">
        <img className="member-photo" src={volunteer.avatar_url || '/avatar.svg'} alt={volunteer.full_name} />
        <div className="member-info">
          <h2>{volunteer.full_name}</h2>
          <p>{volunteer.role || 'متطوع'}</p>
          <div className="member-tags"><span>{volunteer.team_name || volunteer.department || 'أبناء الأرض'}</span><span>{statusLabels[volunteer.volunteer_status || 'active']}</span></div>
          <dl><dt>رقم العضوية</dt><dd>{memberId}</dd><dt>تاريخ الانضمام</dt><dd>{volunteer.joined_date || volunteer.joined_year || 'غير محدد'}</dd></dl>
        </div>
      </div>
      <div className="member-foot">
        <QRCodeSVG value={url} size={92} bgColor="transparent" fgColor="#0b4f3a" />
        <p>امسح الرمز للوصول إلى صفحة العضو والتحقق من بياناته.</p>
      </div>
    </div>
  </section>;
}
