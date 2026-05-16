'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('abnaa-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('abnaa-theme', next ? 'dark' : 'light');
    setDark(next);
  }

  return <button className="theme-toggle" onClick={toggle} aria-label="تبديل الوضع الليلي">
    {dark ? <Sun size={18}/> : <Moon size={18}/>}<span>{dark ? 'نهاري' : 'ليلي'}</span>
  </button>;
}
