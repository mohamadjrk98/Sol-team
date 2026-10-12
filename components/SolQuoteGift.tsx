'use client';
import { useState } from 'react';
const quotes: {text:string;source:string}[] = [{"text": "خير الناس أنفعهم للناس", "source": "مقولة مأثورة"}, {"text": "من كان في حاجة أخيه كان الله في حاجته", "source": "حديث نبوي — متفق عليه"}, {"text": "والله في عون العبد ما كان العبد في عون أخيه", "source": "حديث نبوي — رواه مسلم"}, {"text": "كل معروف صدقة", "source": "حديث نبوي — متفق عليه"}, {"text": "لا تحقرن من المعروف شيئًا", "source": "حديث نبوي — رواه مسلم"}, {"text": "اتقوا النار ولو بشق تمرة", "source": "حديث نبوي — متفق عليه"}, {"text": "الكلمة الطيبة صدقة", "source": "حديث نبوي — متفق عليه"}, {"text": "تبسمك في وجه أخيك لك صدقة", "source": "حديث نبوي — رواه الترمذي"}, {"text": "أحب الأعمال إلى الله أدومها وإن قل", "source": "حديث نبوي — متفق عليه"}, {"text": "إن الله كتب الإحسان على كل شيء", "source": "حديث نبوي — رواه مسلم"}, {"text": "مثل المؤمنين في توادهم وتراحمهم وتعاطفهم مثل الجسد", "source": "حديث نبوي — متفق عليه"}, {"text": "ومن تطوع خيرًا فإن الله شاكر عليم", "source": "القرآن الكريم — البقرة: 158"}, {"text": "فمن يعمل مثقال ذرة خيرًا يره", "source": "القرآن الكريم — الزلزلة: 7"}, {"text": "وتعاونوا على البر والتقوى", "source": "القرآن الكريم — المائدة: 2"}, {"text": "وأحسنوا إن الله يحب المحسنين", "source": "القرآن الكريم — البقرة: 195"}, {"text": "إن الله لا يضيع أجر المحسنين", "source": "القرآن الكريم — التوبة: 120"}, {"text": "وما تقدموا لأنفسكم من خير تجدوه عند الله", "source": "القرآن الكريم — البقرة: 110"}, {"text": "وقولوا للناس حسنًا", "source": "القرآن الكريم — البقرة: 83"}, {"text": "فاستبقوا الخيرات", "source": "القرآن الكريم — البقرة: 148"}, {"text": "هل جزاء الإحسان إلا الإحسان", "source": "القرآن الكريم — الرحمن: 60"}, {"text": "من أحياها فكأنما أحيا الناس جميعًا", "source": "القرآن الكريم — المائدة: 32"}, {"text": "الأثر الطيب يبدأ بخطوة صغيرة", "source": "عبارة تحفيزية"}, {"text": "لا تنتظر فرصة لصنع الخير، اصنعها", "source": "عبارة تحفيزية"}, {"text": "بالعطاء تنمو المجتمعات وتزدهر", "source": "عبارة تحفيزية"}, {"text": "كل يد تساعد تصنع فرقًا", "source": "عبارة تحفيزية"}, {"text": "العمل الجماعي يضاعف أثر الخير", "source": "عبارة تحفيزية"}, {"text": "خير اليوم قد يكون أمل الغد", "source": "عبارة تحفيزية"}, {"text": "امنح وقتك، فقد يكون أغلى ما تمنح", "source": "عبارة تحفيزية"}, {"text": "الرحمة فعل، وليست مجرد كلمة", "source": "عبارة تحفيزية"}, {"text": "العطاء لا يقاس بحجمه بل بأثره", "source": "عبارة تحفيزية"}, {"text": "ازرع خيرًا ولو لم تر ثماره", "source": "عبارة تحفيزية"}, {"text": "حين نتكاتف تصبح الصعاب أهون", "source": "عبارة تحفيزية"}, {"text": "التطوع وعد صادق للمجتمع", "source": "عبارة تحفيزية"}, {"text": "ابتسامة تصنع يومًا أجمل", "source": "عبارة تحفيزية"}, {"text": "كل مبادرة نافذة جديدة للأمل", "source": "عبارة تحفيزية"}, {"text": "كن سببًا في تخفيف عبء عن إنسان", "source": "عبارة تحفيزية"}, {"text": "أجمل الإنجازات ما ترك أثرًا في القلوب", "source": "عبارة تحفيزية"}, {"text": "التغيير يبدأ بمن يقرر أن يساعد", "source": "عبارة تحفيزية"}, {"text": "الخير الذي تشاركه يكبر", "source": "عبارة تحفيزية"}, {"text": "معًا نصنع أثرًا يستمر", "source": "عبارة تحفيزية"}];
export default function SolQuoteGift(){
 const [quote,setQuote]=useState<{text:string;source:string}|null>(null);
 const [previous,setPrevious]=useState(-1);
 function give(){
  let index=Math.floor(Math.random()*quotes.length);
  if(quotes.length>1 && index===previous)index=(index+1)%quotes.length;
  setPrevious(index);setQuote(quotes[index]);
 }
 return <div className="sol-quote-gift" dir="rtl">
  <button className="sol-quote-trigger" type="button" onClick={give} aria-label="أهدني اقتباسًا">✦ أهدني اقتباسًا</button>
  {quote&&<div className="sol-quote-panel" role="status" aria-live="polite">
   <button type="button" className="sol-quote-close" onClick={()=>setQuote(null)} aria-label="إغلاق">×</button>
   <span className="sol-quote-kicker">رسالة خير لك 💚</span>
   <blockquote>«{quote.text}»</blockquote>
   <small>{quote.source}</small>
   <button className="sol-quote-again" type="button" onClick={give}>اقتباس آخر ↻</button>
  </div>}
 </div>;
}
