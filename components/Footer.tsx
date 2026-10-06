import Link from 'next/link';
import { Instagram, MapPin, Phone } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

export default function Footer({ settings }: { settings: SiteSettings }) {
  return <footer className="footer">
    <div className="container footer-grid">
      <div><strong>{settings.team_name}</strong><p>{settings.slogan}</p></div>
      <div className="footer-contact"><span><MapPin size={16}/>{settings.location}</span><span><Phone size={16}/>{settings.phone}</span><span><Instagram size={16}/>@{settings.instagram}</span></div>
      <div className="footer-links"><Link href="/join">انضم للفريق</Link><Link href="/transparency">الشفافية</Link><Link href="/blog">أعمالنا</Link></div>
    </div>
  </footer>;
}
