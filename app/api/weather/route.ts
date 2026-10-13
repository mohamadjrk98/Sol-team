import { NextResponse } from 'next/server';

export const revalidate = 1800;
export async function GET() {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  const args: Record<string, string> = {
    latitude: '35.1318', longitude: '36.7511',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
    timezone: 'Asia/Damascus', forecast_days: '7',
  };
  Object.entries(args).forEach(([key, value]) => url.searchParams.set(key, value));
  try {
    const response = await fetch(url.toString(), { next: { revalidate: 1800 }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Weather provider status ${response.status}`);
    const data = await response.json();
    if (!data?.current || !data?.daily?.time) throw new Error('Incomplete weather data');
    return NextResponse.json({ current: data.current, current_units: data.current_units, daily: data.daily, timezone: data.timezone, updated_at: data.current.time }, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch {
    return NextResponse.json({ error: 'تعذر جلب حالة الطقس حالياً. حاول لاحقاً.' }, { status: 503 });
  }
}
