'use client';
import { LogOut } from 'lucide-react';

export default function AdminLogout() {
  async function logout() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    window.location.href = '/';
  }
  return <button className="btn admin-logout" type="button" onClick={logout}><LogOut size={17}/> خروج الإدارة</button>;
}
