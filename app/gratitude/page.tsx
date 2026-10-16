import type {Metadata} from 'next';
import GratitudeWall from '@/components/GratitudeWall';
export const metadata:Metadata={title:'جدار الامتنان',description:'رسائل شكر وتقدير من مجتمع فريق أبناء الأرض التطوعي'};
export default function Page(){return <main className="container sol-gratitude-page"><GratitudeWall/></main>}
