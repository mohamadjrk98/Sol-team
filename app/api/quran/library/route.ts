import { NextResponse } from 'next/server';

export const revalidate = 21600;
export const runtime = 'nodejs';

type Surah = { id: number; name: string };
type Moshaf = { id: number; name: string; server: string; surah_list: string };
type Reciter = { id: number; name: string; moshaf: Moshaf[] };

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`MP3Quran API HTTP ${res.status}`);
  return res.json();
}
export async function GET() {
  try {
    const [surahJson, reciterJson] = await Promise.all([
      getJson('https://mp3quran.net/api/v3/suwar?language=ar'),
      getJson('https://mp3quran.net/api/v3/reciters?language=ar')
    ]);
    const rawSurahs = (surahJson as { suwar?: Surah[] })?.suwar;
    const rawReciters = (reciterJson as { reciters?: Reciter[] })?.reciters;
    if (!Array.isArray(rawSurahs) || !Array.isArray(rawReciters)) throw new Error('Unexpected response');
    const surahs = rawSurahs.filter(s => Number.isInteger(s.id) && s.id >= 1 && s.id <= 114 && typeof s.name === 'string')
      .map(s => ({ id: s.id, name: s.name.trim() })).sort((a,b) => a.id - b.id);
    const reciters = rawReciters.filter(r => typeof r.name === 'string' && Array.isArray(r.moshaf)).map(r => ({
      id: r.id, name: r.name.trim(), moshaf: r.moshaf.filter(m => {
        try { const u = new URL(m.server); return u.protocol === 'https:' && (u.hostname === 'mp3quran.net' || u.hostname.endsWith('.mp3quran.net')) && typeof m.surah_list === 'string'; }
        catch { return false; }
      }).map(m => ({ id: m.id, name: m.name, server: m.server, surahs: m.surah_list.split(',').map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 114) }))
    })).filter(r => r.moshaf.length > 0).sort((a,b) => a.name.localeCompare(b.name, 'ar'));
    if (surahs.length !== 114 || !reciters.length) throw new Error('Incomplete Quran catalog');
    return NextResponse.json({ surahs, reciters }, { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' } });
  } catch {
    return NextResponse.json({ error: 'تعذر تحميل مكتبة التلاوات حالياً. يرجى إعادة المحاولة لاحقاً.' }, { status: 503 });
  }
}
