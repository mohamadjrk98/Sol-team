'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {Lightbulb,RefreshCcw,Share2,CheckCircle2} from 'lucide-react';

type Question={q:string;choices:[string,string,string,string];answer:number;explanation:string;category:string};
const QUESTIONS:Question[]=[
{q:'ما أكبر محيط على سطح الأرض؟',choices:['الأطلسي','الهادئ','الهندي','المتجمد الشمالي'],answer:1,explanation:'المحيط الهادئ هو الأكبر مساحةً بين محيطات العالم.',category:'جغرافيا'},
{q:'كم عدد كواكب المجموعة الشمسية المعترف بها؟',choices:['7','8','9','10'],answer:1,explanation:'تضم المجموعة الشمسية ثمانية كواكب؛ وصُنّف بلوتو كوكباً قزماً.',category:'فضاء'},
{q:'ما العضو الذي يضخ الدم في جسم الإنسان؟',choices:['الرئة','الكبد','القلب','المعدة'],answer:2,explanation:'القلب عضلة تضخ الدم عبر الأوعية الدموية.',category:'علوم'},
{q:'في أي قارة تقع سوريا؟',choices:['أوروبا','آسيا','أفريقيا','أمريكا الجنوبية'],answer:1,explanation:'تقع سوريا في غرب قارة آسيا.',category:'جغرافيا'},
{q:'ما الغاز الذي تمتصه النباتات غالباً أثناء البناء الضوئي؟',choices:['الأكسجين','ثاني أكسيد الكربون','الهيليوم','النيون'],answer:1,explanation:'تستخدم النباتات ثاني أكسيد الكربون والماء والضوء لإنتاج مواد غذائية.',category:'طبيعة'},
{q:'ما الكوكب المعروف بالكوكب الأحمر؟',choices:['الزهرة','المشتري','المريخ','عطارد'],answer:2,explanation:'يبدو المريخ مائلاً للأحمر بسبب أكاسيد الحديد على سطحه.',category:'فضاء'},
{q:'كم دقيقة في ساعتين؟',choices:['60','90','120','180'],answer:2,explanation:'كل ساعة 60 دقيقة؛ ساعتان تساويان 120 دقيقة.',category:'معلومات عامة'},
{q:'ما وحدة قياس شدة التيار الكهربائي؟',choices:['الفولت','الأمبير','الواط','الأوم'],answer:1,explanation:'الأمبير هو وحدة قياس شدة التيار الكهربائي.',category:'علوم'},
{q:'أي من هذه الحيوانات من الثدييات؟',choices:['الدلفين','القرش','الأخطبوط','السردين'],answer:0,explanation:'الدلفين ثديي يتنفس الهواء ويرضع صغاره.',category:'طبيعة'},
{q:'ما اللغة الرسمية في البرازيل؟',choices:['الإسبانية','البرتغالية','الفرنسية','الإيطالية'],answer:1,explanation:'البرتغالية هي اللغة الرسمية للبرازيل.',category:'ثقافة'},
{q:'ما اسم العملية التي يتحول فيها الماء إلى بخار؟',choices:['التجمد','التكاثف','التبخر','الترسيب'],answer:2,explanation:'التبخر هو انتقال الماء من الحالة السائلة إلى الغازية.',category:'علوم'},
{q:'كم عدد أضلاع الشكل السداسي؟',choices:['5','6','7','8'],answer:1,explanation:'الشكل السداسي له ستة أضلاع.',category:'معلومات عامة'},
{q:'أي جهاز يستخدم لقياس درجة الحرارة؟',choices:['البارومتر','الترمومتر','البوصلة','الميزان'],answer:1,explanation:'الترمومتر يقيس درجة الحرارة.',category:'علوم'},
{q:'ما أكبر كوكب في المجموعة الشمسية؟',choices:['الأرض','زحل','المشتري','نبتون'],answer:2,explanation:'المشتري أكبر كواكب المجموعة الشمسية.',category:'فضاء'},
{q:'ما عاصمة اليابان؟',choices:['أوساكا','طوكيو','كيوتو','ناغويا'],answer:1,explanation:'طوكيو هي عاصمة اليابان.',category:'جغرافيا'},
{q:'أي فيتامين يصنعه الجسم في الجلد عند التعرض المناسب للشمس؟',choices:['فيتامين C','فيتامين D','فيتامين B12','فيتامين K'],answer:1,explanation:'يساهم ضوء الشمس في تصنيع فيتامين D في الجلد.',category:'صحة'},
{q:'أي مما يلي مصدر طاقة متجددة؟',choices:['الفحم','النفط','الرياح','الغاز الطبيعي'],answer:2,explanation:'الرياح مصدر طاقة متجددة يستخدم في توليد الكهرباء.',category:'بيئة'},
{q:'ما الكوكب الأقرب إلى الشمس؟',choices:['الأرض','عطارد','الزهرة','المريخ'],answer:1,explanation:'عطارد هو أقرب كواكب المجموعة الشمسية إلى الشمس.',category:'فضاء'},
{q:'ما المادة الأساسية التي يصنع منها الزجاج التقليدي؟',choices:['الرمل','الخشب','القطن','الطين فقط'],answer:0,explanation:'يستخدم الرمل الغني بالسيليكا في صناعة الزجاج.',category:'علوم'},
{q:'ما الأداة التي تحدد الاتجاهات الأصلية؟',choices:['المجهر','البوصلة','المسطرة','الساعة'],answer:1,explanation:'تستخدم البوصلة لتحديد الاتجاهات.',category:'معلومات عامة'},
{q:'ما اسم المجرة التي تقع فيها مجموعتنا الشمسية؟',choices:['أندروميدا','درب التبانة','المثلث','سومبريرو'],answer:1,explanation:'تقع الشمس والأرض ضمن مجرة درب التبانة.',category:'فضاء'},
{q:'كم عدد أيام السنة الكبيسة في التقويم الميلادي؟',choices:['364','365','366','367'],answer:2,explanation:'السنة الكبيسة في التقويم الميلادي 366 يوماً.',category:'معلومات عامة'},
{q:'أي من التالي يساعد على تقليل النفايات؟',choices:['الاستخدام لمرة واحدة','إعادة الاستخدام','الحرق العشوائي','رمي البلاستيك'],answer:1,explanation:'إعادة الاستخدام تقلل استهلاك المواد وتوليد النفايات.',category:'بيئة'},
{q:'ما الجهاز الذي يستخدم لتكبير الأجسام الصغيرة جداً؟',choices:['التلسكوب','المجهر','الرادار','الميزان'],answer:1,explanation:'المجهر يتيح رؤية تفاصيل الأجسام الدقيقة.',category:'علوم'},
{q:'أي عضو مسؤول أساساً عن تبادل الأكسجين وثاني أكسيد الكربون؟',choices:['الرئتان','المعدة','الكليتان','الطحال'],answer:0,explanation:'يحدث تبادل الغازات داخل الحويصلات الهوائية في الرئتين.',category:'صحة'},
{q:'ما عاصمة الأردن؟',choices:['إربد','الزرقاء','عمّان','العقبة'],answer:2,explanation:'عمّان هي عاصمة المملكة الأردنية الهاشمية.',category:'جغرافيا'},
{q:'ما وحدة قياس التردد؟',choices:['هرتز','متر','كيلوغرام','جول'],answer:0,explanation:'الهرتز يقيس عدد الدورات أو الاهتزازات في الثانية.',category:'علوم'},
{q:'أي من هذه المواد ينجذب عادةً للمغناطيس؟',choices:['الحديد','الخشب','الزجاج','البلاستيك'],answer:0,explanation:'الحديد من المواد التي تنجذب للمغناطيس.',category:'علوم'},
{q:'ما القارة التي تقع فيها مصر؟',choices:['آسيا فقط','أفريقيا أساساً','أوروبا','أستراليا'],answer:1,explanation:'تقع معظم أراضي مصر في أفريقيا، بينما تقع سيناء في آسيا.',category:'جغرافيا'},
{q:'ما الاسم الشائع لعملية جمع مياه المطر واستخدامها لاحقاً؟',choices:['حصاد مياه الأمطار','التصحر','التبخر','التسامي'],answer:0,explanation:'حصاد مياه الأمطار هو جمع مياه الهطول وتخزينها للاستفادة منها.',category:'بيئة'}
];
function syriaDay(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Damascus',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function dayIndex(date:string){const [y,m,d]=date.split('-').map(Number);return Math.floor(Date.UTC(y,m-1,d)/86400000);}
export default function DailyQuestion({compact=false}:{compact?:boolean}){
 const [date,setDate]=useState('');const [chosen,setChosen]=useState<number|null>(null);const [copied,setCopied]=useState(false);
 useEffect(()=>{const update=()=>setDate(syriaDay());update();const id=setInterval(update,60000);return()=>clearInterval(id);},[]);
 const index=useMemo(()=>date?((dayIndex(date)%QUESTIONS.length)+QUESTIONS.length)%QUESTIONS.length:0,[date]);
 const question=QUESTIONS[index];
 useEffect(()=>{if(!date)return;try{const v=localStorage.getItem('sol-daily-question-'+date);setChosen(v===null?null:Number(v));}catch{setChosen(null);}},[date]);
 function answer(n:number){if(chosen!==null||!date)return;setChosen(n);try{localStorage.setItem('sol-daily-question-'+date,String(n));}catch{}}
 async function share(){const msg=`سؤال اليوم من SOL TEAM:\n${question.q}\n${question.choices.map((v,i)=>`${i+1}. ${v}`).join('\n')}\n${location.origin}/daily-question`;try{if(navigator.share){await navigator.share({text:msg});return;}await navigator.clipboard.writeText(msg);setCopied(true);}catch{}}
 return <section className={'sol-daily-card'+(compact?' sol-daily-compact':'')} aria-label="سؤال اليوم"><div className="sol-daily-head"><span><Lightbulb size={22}/> سؤال اليوم</span><small>{question.category} • {date||'...'}</small></div><h2>{question.q}</h2><div className="sol-daily-answers">{question.choices.map((option,i)=><button key={i} type="button" onClick={()=>answer(i)} disabled={chosen!==null||!date} className={chosen!==null?(i===question.answer?'correct':i===chosen?'incorrect':''):''} aria-pressed={chosen===i}>{option}</button>)}</div>{chosen!==null&&<div className="sol-daily-result" role="status"><strong><CheckCircle2 size={18}/>{chosen===question.answer?'إجابة صحيحة! أحسنت 👏':'إجابة غير صحيحة، تعلّم معلومة جديدة 💚'}</strong><p>{question.explanation}</p></div>}<div className="sol-daily-actions"><button type="button" onClick={share}><Share2 size={16}/>{copied?'تم نسخ السؤال':'شارك التحدي'}</button>{compact&&<Link href="/daily-question">افتح سؤال اليوم ←</Link>}</div><small className="sol-daily-note">يتجدد السؤال كل يوم بتوقيت سوريا. يتم حفظ إجابتك على هذا الجهاز فقط.</small></section>;
}
