import type {Metadata} from 'next';
import DailyPuzzle from '@/components/DailyPuzzle';
export const metadata:Metadata={title:'لغز الذكاء اليومي',description:'لغز ذكاء عربي جديد كل يوم من فريق أبناء الأرض'};
export default function DailyPuzzlePage(){return <main className="container sol-puzzle-page"><div className="sol-puzzle-intro"><span className="section-kicker">تحدٍ جديد كل يوم</span><h1>🧠 لغز الذكاء اليومي</h1><p>فكّر وحاول الحل قبل الكشف عن الإجابة. شارك اللغز مع أصدقائك!</p></div><DailyPuzzle/></main>}
