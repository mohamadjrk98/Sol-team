'use client';

import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { useState } from 'react';
import { Download, Loader2, Printer } from 'lucide-react';
import { Volunteer } from '@/lib/types';

const statusLabels: Record<string, string> = {
  active: 'نشط',
  vacation: 'إجازة',
  paused: 'معلّق',
  left: 'غادر',
  dismissed: 'تم فصله',
};

function safeFileName(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export default function MembershipCard({ volunteer, url }: { volunteer: Volunteer; url: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const memberId = `SOL-${String(volunteer.position_rank || 0).padStart(3, '0')}-${volunteer.slug.slice(0, 4).toUpperCase()}`;

  async function downloadPDF() {
    const card = document.getElementById('member-card-print');
    if (!card || isExporting) return;

    setError('');
    setIsExporting(true);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(card, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
        compress: true,
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
      pdf.save(`بطاقة-عضوية-${safeFileName(volunteer.full_name || volunteer.slug)}.pdf`);
    } catch (err) {
      console.error(err);
      setError('تعذر تصدير البطاقة كـ PDF. جرّب الطباعة أو تأكد من أن الصورة مرفوعة بشكل صحيح.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="member-card-wrap">
      <div className="member-actions no-print">
        <button className="btn" type="button" onClick={downloadPDF} disabled={isExporting}>
          {isExporting ? <Loader2 size={17} className="spin" /> : <Download size={17} />}
          {isExporting ? 'جاري تجهيز PDF...' : 'تحميل بطاقة PDF'}
        </button>
        <button className="btn ghost" type="button" onClick={() => window.print()}>
          <Printer size={17} />
          طباعة
        </button>
      </div>
      {error && <p className="pdf-error no-print">{error}</p>}

      <div className="member-card" id="member-card-print">
        <div className="member-bg" />
        <div className="member-head">
          <Image src="/logo.png" width={58} height={58} alt="شعار أبناء الأرض" />
          <div>
            <strong>فريق أبناء الأرض التطوعي</strong>
            <span>بطاقة عضوية رسمية</span>
          </div>
        </div>
        <div className="member-body">
          <img className="member-photo" src={volunteer.avatar_url || '/avatar.svg'} alt={volunteer.full_name} crossOrigin="anonymous" />
          <div className="member-info">
            <h2>{volunteer.full_name}</h2>
            <p>{volunteer.role || 'متطوع'}</p>
            <div className="member-tags">
              <span>{volunteer.team_name || volunteer.department || 'أبناء الأرض'}</span>
              <span>{statusLabels[volunteer.volunteer_status || 'active']}</span>
            </div>
            <dl>
              <dt>رقم العضوية</dt>
              <dd>{memberId}</dd>
              <dt>تاريخ الانضمام</dt>
              <dd>{volunteer.joined_date || volunteer.joined_year || 'غير محدد'}</dd>
            </dl>
          </div>
        </div>
        <div className="member-foot">
          <QRCodeSVG value={url} size={92} bgColor="transparent" fgColor="#0b4f3a" />
          <p>امسح الرمز للوصول إلى صفحة العضو والتحقق من بياناته.</p>
        </div>
      </div>
    </section>
  );
}
