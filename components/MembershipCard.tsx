'use client';

import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { useState } from 'react';
import { Download, Loader2, Printer, RefreshCw } from 'lucide-react';
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
  const [flipped, setFlipped] = useState(false);
  const memberId = `SOL-${String(volunteer.position_rank || 0).padStart(3, '0')}-${volunteer.slug.slice(0, 4).toUpperCase()}`;


  async function downloadPDF() {
    if (isExporting) return;

    setError('');
    setIsExporting(true);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const faces = [
        document.getElementById('sol-id-front-export'),
        document.getElementById('sol-id-back-export'),
      ];

      if (faces.some(face => !face)) {
        throw new Error('Missing export face');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85, 135],
        compress: true,
      });

      for (let i = 0; i < faces.length; i++) {
        const canvas = await html2canvas(faces[i]!, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#063d30',
          logging: false,
        });

        if (i > 0) pdf.addPage([85, 135], 'portrait');

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          85,
          135,
          undefined,
          'FAST'
        );
      }

      pdf.save(`بطاقة-عضوية-${safeFileName(volunteer.full_name || volunteer.slug)}.pdf`);
    } catch (err) {
      console.error(err);
      setError('تعذر تجهيز PDF. تأكد من تحميل الصورة ثم حاول مجدداً.');
    } finally {
      setIsExporting(false);
    }
  }

  const teams = volunteer.team_names?.length
    ? volunteer.team_names.join(' • ')
    : (volunteer.team_name || volunteer.department || 'أبناء الأرض');

  const status = statusLabels[volunteer.volunteer_status || 'active'] || 'غير محدد';

  function CardFront() {
    return (
      <div className="sol-id-content">
        <div className="sol-id-glow" aria-hidden="true" />
        <header className="sol-id-header">
          <Image src="/logo.png" width={62} height={62} alt="شعار الفريق" />
          <div>
            <strong>فريق أبناء الأرض التطوعي</strong>
            <small>أمل ينمو وأثر يبقى</small>
            <span>VOLUNTEER IDENTITY</span>
          </div>
        </header>

        <div className="sol-id-center">
          <div className="sol-id-avatar-frame">
            <img
              src={volunteer.avatar_url || '/avatar.svg'}
              alt={volunteer.full_name}
              crossOrigin="anonymous"
            />
          </div>

          <h2>{volunteer.full_name}</h2>
          <p className="sol-id-role">{volunteer.role || 'متطوع'}</p>
          <p className="sol-id-team">{teams}</p>
        </div>

        <footer className="sol-id-bottom">
          <span>OFFICIAL VOLUNTEER CARD</span>
          <strong>{memberId}</strong>
        </footer>
      </div>
    );
  }

  function CardBack() {
    return (
      <div className="sol-id-content sol-id-back-content">
        <div className="sol-id-glow" aria-hidden="true" />

        <header className="sol-id-back-header">
          <Image src="/logo.png" width={55} height={55} alt="شعار الفريق" />
          <strong>الهوية التطوعية الرقمية</strong>
          <span>DIGITAL MEMBERSHIP</span>
        </header>

        <div className="sol-id-details">
          <div>
            <span>رقم العضوية</span>
            <strong dir="ltr">{memberId}</strong>
          </div>

          <div>
            <span>تاريخ الانضمام</span>
            <strong>{volunteer.joined_date || volunteer.joined_year || 'غير محدد'}</strong>
          </div>

          {volunteer.specialization && (
            <div>
              <span>الاختصاص</span>
              <strong>{volunteer.specialization}</strong>
            </div>
          )}

          <div>
            <span>حالة العضوية</span>
            <strong>{status}</strong>
          </div>
        </div>

        <div className="sol-id-qr">
          <div>
            <QRCodeSVG
              value={url}
              size={110}
              bgColor="#ffffff"
              fgColor="#063d30"
              marginSize={2}
            />
          </div>
          <p>امسح الرمز لعرض الملف التعريفي للمتطوع</p>
        </div>

        <footer className="sol-id-back-footer">
          SOL TEAM • OFFICIAL IDENTITY
        </footer>
      </div>
    );
  }

  return (
    <section className="member-card-wrap sol-id-wrap">
      <div className="member-actions no-print">
        <button
          className="btn sol-id-flip-btn"
          type="button"
          onClick={() => setFlipped(value => !value)}
          aria-pressed={flipped}
        >
          <RefreshCw size={17} />
          {flipped ? 'عرض الوجه الأمامي' : 'قلب البطاقة'}
        </button>

        <button
          className="btn"
          type="button"
          onClick={downloadPDF}
          disabled={isExporting}
        >
          {isExporting
            ? <Loader2 size={17} className="spin" />
            : <Download size={17} />}
          {isExporting ? 'جاري تجهيز PDF...' : 'تحميل PDF — الوجهين'}
        </button>

        <button
          className="btn ghost"
          type="button"
          onClick={() => window.print()}
        >
          <Printer size={17} />
          طباعة
        </button>
      </div>

      {error && <p className="pdf-error no-print">{error}</p>}

      <div className="sol-3d-scene no-print">
        <div className={`sol-3d-card ${flipped ? 'is-flipped' : ''}`}>
          <div className="sol-3d-face sol-3d-front">
            <CardFront />
          </div>

          <div className="sol-3d-face sol-3d-back">
            <CardBack />
          </div>
        </div>
      </div>

      <div className="sol-id-export-area" aria-hidden="true">
        <div id="sol-id-front-export" className="sol-id-export-face">
          <CardFront />
        </div>
        <div id="sol-id-back-export" className="sol-id-export-face">
          <CardBack />
        </div>
      </div>
    </section>
  );
}
