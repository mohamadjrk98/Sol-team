import type { Metadata } from 'next';
import QuranLibrary from '@/components/QuranLibrary';
export const metadata: Metadata = { title: 'مكتبة القرآن الكريم', description: 'استمع إلى سور القرآن الكريم بأصوات القراء من مكتبة التلاوات الصوتية.' };
export default function QuranPage() { return <QuranLibrary />; }
