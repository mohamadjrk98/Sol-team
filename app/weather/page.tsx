import type { Metadata } from 'next';
import HamaWeather from '@/components/HamaWeather';
export const metadata: Metadata = { title: 'طقس حماة', description: 'حالة الطقس الحالية وتوقعات الأسبوع لمدينة حماة في سوريا' };
export default function WeatherPage() { return <main className="section sol-weather-page"><div className="container"><HamaWeather /></div></main>; }
