'use client';
import { useCallback, useEffect, useState } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, RefreshCw, Sun, Thermometer, Wind } from 'lucide-react';

type Current = { temperature_2m: number; apparent_temperature: number; relative_humidity_2m: number; wind_speed_10m: number; weather_code: number; is_day: number; time: string };
type Daily = { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: (number | null)[]; weather_code: number[] };
type Weather = { current: Current; daily: Daily; timezone: string; updated_at: string };
function description(code: number): string {
  if (code === 0) return 'سماء صافية';
  if ([1, 2].includes(code)) return 'غائم جزئياً';
  if (code === 3) return 'غائم';
  if ([45, 48].includes(code)) return 'ضباب';
  if ([51, 53, 55, 56, 57].includes(code)) return 'رذاذ';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'أمطار';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'ثلوج';
  if ([95, 96, 99].includes(code)) return 'عواصف رعدية';
  return 'حالة جوية متغيرة';
}
function WeatherIcon({ code, day = true, size = 32 }: { code: number; day?: boolean; size?: number }) {
  if ([95, 96, 99].includes(code)) return <CloudLightning size={size} aria-hidden="true" />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow size={size} aria-hidden="true" />;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain size={size} aria-hidden="true" />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle size={size} aria-hidden="true" />;
  if ([45, 48].includes(code)) return <CloudFog size={size} aria-hidden="true" />;
  if (code === 0) return day ? <Sun size={size} aria-hidden="true" /> : <CloudSun size={size} aria-hidden="true" />;
  return code === 3 ? <Cloud size={size} aria-hidden="true" /> : <CloudSun size={size} aria-hidden="true" />;
}
const temp = (n: number | undefined) => Number.isFinite(n) ? `${Math.round(n!)}°` : '—';
export default function HamaWeather({ compact = false }: { compact?: boolean }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/weather');
      const json = await res.json();
      if (!res.ok || !json.current || !json.daily) throw new Error(json.error || 'تعذر تحميل الطقس');
      setWeather(json);
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر تحميل الطقس'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return <div className={`sol-weather-widget ${compact ? 'sol-weather-compact' : ''}`}>
    <div className="sol-weather-top"><div><span className="section-kicker">الطقس في سوريا</span><h2>طقس مدينة حماة</h2><p className="muted">الحرارة الحالية وتوقعات الأيام السبعة القادمة</p></div><button className="sol-weather-refresh" type="button" disabled={loading} onClick={() => void refresh()} aria-label="تحديث الطقس"><RefreshCw size={19} /> تحديث</button></div>
    {loading && !weather && <p role="status">جاري تحميل بيانات الطقس...</p>}
    {error && <p className="sol-weather-error" role="alert">{error} <button type="button" onClick={() => void refresh()}>إعادة المحاولة</button></p>}
    {weather && <><div className="sol-weather-current"><div className="sol-weather-condition"><WeatherIcon code={weather.current.weather_code} day={weather.current.is_day === 1} size={56}/><div><strong className="sol-weather-temperature">{temp(weather.current.temperature_2m)}</strong><p>{description(weather.current.weather_code)}</p></div></div><div className="sol-weather-details"><span><Thermometer size={18}/> المحسوسة: {temp(weather.current.apparent_temperature)}</span><span><Droplets size={18}/> الرطوبة: {weather.current.relative_humidity_2m}%</span><span><Wind size={18}/> الرياح: {Math.round(weather.current.wind_speed_10m)} كم/سا</span></div></div>
    {!compact && <div className="sol-weather-days">{weather.daily.time.map((date, i) => <div className="sol-weather-day" key={date}><strong>{new Intl.DateTimeFormat('ar-SY', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))}</strong><small>{date}</small><WeatherIcon code={weather.daily.weather_code[i]} size={28}/><span>{description(weather.daily.weather_code[i])}</span><b>{temp(weather.daily.temperature_2m_max[i])} / {temp(weather.daily.temperature_2m_min[i])}</b><small>احتمال المطر: {weather.daily.precipitation_probability_max[i] ?? '—'}%</small></div>)}</div>}
    <p className="sol-weather-source">المصدر: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · البيانات تقديرية وقد تختلف عن الحالة الفعلية · آخر تحديث: {weather.updated_at?.replace('T', ' ') || '—'} بتوقيت دمشق</p></>}
  </div>;
}
