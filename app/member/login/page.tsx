'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function internalEmail(username: string) {
  return `${username.trim().toLowerCase()}@members.sol-team.local`;
}

export default function MemberLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/member');
    });
  }, [router]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername || !password) {
      return setError('أدخل اسم المستخدم وكلمة المرور.');
    }

    if (!supabase) {
      return setError('خدمة تسجيل الدخول غير متاحة حالياً.');
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: internalEmail(cleanUsername),
      password
    });

    setLoading(false);

    if (authError) {
      return setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }

    router.replace('/member');
    router.refresh();
  }

  return (
    <main className="admin-shell">
      <section className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <form className="card admin-form luxury-form" onSubmit={login}>
            <div className="form-title">
              <div>
                <span className="eyebrow">فريق أبناء الأرض التطوعي</span>
                <h1>دخول المتطوعين</h1>
                <p className="muted">سجّل الدخول إلى حسابك لإدارة ساعاتك التطوعية.</p>
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <label className="label">
              اسم المستخدم
              <input
                className="input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="label">
              كلمة المرور
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
