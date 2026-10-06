import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ClipboardList, Gauge, Settings, UsersRound, FolderKanban } from 'lucide-react';
import AdminLogout from '@/components/AdminLogout';
import { ADMIN_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!verifyAdminSessionToken(token)) redirect('/');
  return <>
    <div className="admin-topbar">
      <div className="container admin-topbar-inner">
        <nav className="admin-nav" aria-label="تنقل لوحة الإدارة">
          <Link href="/admin/dashboard"><Gauge size={17}/> الرئيسية</Link>
          <Link href="/admin"><UsersRound size={17}/> المتطوعون</Link>
          <Link href="/admin/initiatives"><FolderKanban size={17}/> المبادرات</Link>
          <Link href="/admin/applications"><ClipboardList size={17}/> طلبات الانضمام</Link>
          <Link href="/admin/settings"><Settings size={17}/> إعدادات الموقع</Link>
        </nav>
        <AdminLogout />
      </div>
    </div>
    {children}
  </>;
}
