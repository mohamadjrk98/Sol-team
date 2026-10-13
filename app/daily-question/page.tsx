import type {Metadata} from 'next';
import DailyQuestion from '@/components/DailyQuestion';
export const metadata:Metadata={title:'سؤال اليوم',description:'اختبر معلوماتك يومياً مع سؤال ثقافي جديد من فريق أبناء الأرض'};
export default function DailyQuestionPage(){return <main className="container sol-daily-page"><div className="sol-daily-intro"><span className="section-kicker">تحدي يومي جديد</span><h1>سؤال اليوم 💡</h1><p>كل يوم سؤال مختلف. اختر إجابتك واكتشف المعلومة الصحيحة.</p></div><DailyQuestion/></main>}
