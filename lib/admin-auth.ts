import crypto from 'crypto';

export const ADMIN_COOKIE = 'sol_admin_session';
const SESSION_HOURS = 12;

function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'sol.';
}

function signingSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || `${adminPassword()}::sol-team-admin-session-v2`;
}

function sign(value: string) {
  return crypto.createHmac('sha256', signingSecret()).update(value).digest('hex');
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export function verifyAdminPassword(password: string) {
  return safeEqual(password, adminPassword());
}

export function createAdminSessionToken() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;
  const [expiresRaw, signature] = token.split('.');
  if (!expiresRaw || !signature) return false;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  return safeEqual(signature, sign(expiresRaw));
}

export function getAdminTokenFromRequest(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function isAdminRequest(req: Request) {
  return verifyAdminSessionToken(getAdminTokenFromRequest(req));
}

export const ADMIN_SESSION_MAX_AGE = SESSION_HOURS * 60 * 60;
