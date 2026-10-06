import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  getAdminTokenFromRequest,
  verifyAdminPassword,
  verifyAdminSessionToken
} from '@/lib/admin-auth';

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX_ATTEMPTS = 7;

function clientKey(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}

function blocked(req: Request) {
  const now = Date.now();
  const key = clientKey(req);
  const state = attempts.get(key);
  if (!state || state.resetAt < now) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW });
    return false;
  }
  return state.count >= MAX_ATTEMPTS;
}

function registerFailure(req: Request) {
  const key = clientKey(req);
  const now = Date.now();
  const state = attempts.get(key);
  if (!state || state.resetAt < now) attempts.set(key, { count: 1, resetAt: now + WINDOW });
  else attempts.set(key, { ...state, count: state.count + 1 });
}

export async function GET(req: Request) {
  return NextResponse.json({ authenticated: verifyAdminSessionToken(getAdminTokenFromRequest(req)) });
}

export async function POST(req: Request) {
  if (blocked(req)) return NextResponse.json({ error: 'محاولات كثيرة. حاول لاحقاً.' }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || '');
  if (!verifyAdminPassword(password)) {
    registerFailure(req);
    return NextResponse.json({ error: 'كلمة المرور غير صحيحة.' }, { status: 401 });
  }
  attempts.delete(clientKey(req));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
