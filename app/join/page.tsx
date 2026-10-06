'use client';
import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, HeartHandshake, MailCheck, Send, ShieldCheck, Users } from 'lucide-react';

const steps = [
  { title: 'معلوماتك', text: 'بيانات التواصل الأساسية' },
  { title: 'اهتماماتك', text: 'مهاراتك والفريق المناسب' },
  { title: 'دافعك', text: 'سبب التطوع والتفرغ' }
];

export default function JoinPage(){
  const [step,setStep]=useState(0); const[loading,setLoading]=useState(false);const[error,setError]=useState('');const[done,setDone]=useState(false);
  const progress=useMemo(()=>((step+1)/steps.length)*100,[step]);

  function next(){ setError(''); const form=document.getElementById('join-form') as HTMLFormElement|null; if(!form)return; const section=form.querySelector(`[data-step="${step}"]`); const fields=section?.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('input,textarea,select'); for(const field of Array.from(fields||[])){if(!field.checkValidity()){field.reportValidity();return}} setStep(s=>Math.min(steps.length-1,s+1)); window.scrollTo({top:0,behavior:'smooth'}); }
  function back(){setError('');setStep(s=>Math.max(0,s-1));}
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError('');setLoading(true);const form=new FormData(e.currentTarget);const payload=Object.fromEntries(form.entries());const res=await fetch('/api/join',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const json=await res.json().catch(()=>({}));setLoading(false);if(!res.ok)return setError(json.error||'تعذر إرسال الطلب. حاول مرة أخرى.');setDone(true);window.scrollTo({top:0,behavior:'smooth'});}

  if(done)return <main><section className="hero join-success-hero"><div className="container narrow"><div className="success-panel"><CheckCircle2 size={64}/><span className="eyebrow">تم استلام طلبك</span><h1>شكراً لأنك اخترت أن تصنع أثراً</h1><p>وصل طلب الانضمام إلى الإدارة بنجاح. لا تحتاج إلى إنشاء حساب أو تسجيل دخول؛ سيتم التواصل معك عبر البيانات التي أرسلتها بعد مراجعة الطلب.</p><a className="btn yellow" href="/">العودة إلى الرئيسية</a></div></div></section></main>;

  return <main>
    <section className="hero compact-hero"><div className="container hero-grid"><div><span className="eyebrow">الانضمام إلى الفريق</span><h1>خطوات بسيطة. أثر حقيقي.</h1><p className="lead">أرسل طلبك مباشرة بدون حساب. قسمنا النموذج إلى ثلاث خطوات قصيرة حتى تكون العملية واضحة وسريعة.</p></div><div className="hero-card"><Users size={44}/><h2>مكانك قد يكون معنا</h2><p className="muted light-text">نبحث عن الالتزام وروح المبادرة قبل الخبرة. اختر ما يناسبك وسنتولى المراجعة والتواصل.</p></div></div></section>

    <section className="section"><div className="container join-shell">
      <aside className="join-steps card">
        <div className="join-progress"><span style={{width:`${progress}%`}}/></div>
        {steps.map((s,i)=><button type="button" key={s.title} className={`join-step ${i===step?'active':''} ${i<step?'done':''}`} onClick={()=>{if(i<step)setStep(i)}}><span>{i<step?<CheckCircle2 size={18}/>:i+1}</span><div><strong>{s.title}</strong><small>{s.text}</small></div></button>)}
        <div className="privacy-note"><ShieldCheck size={22}/><div><strong>خصوصية أبسط</strong><p>لا يوجد حساب متطوع ولا كلمة مرور. البيانات تستخدم فقط لمراجعة طلب الانضمام والتواصل.</p></div></div>
      </aside>

      <div className="card join-card premium-form-card"><div className="form-step-head"><span>الخطوة {step+1} من {steps.length}</span><h2>{steps[step].title}</h2><p>{steps[step].text}</p></div>{error&&<p className="error">{error}</p>}
      <form id="join-form" className="admin-form" onSubmit={submit}>
        <div data-step="0" hidden={step!==0}><div className="form-grid two"><label className="label">الاسم الكامل<input className="input" name="full_name" required minLength={3} placeholder="الاسم الثلاثي"/></label><label className="label">رقم الهاتف<input className="input" name="phone" required minLength={7} inputMode="tel" placeholder="رقم يمكن التواصل عبره"/></label><label className="label">البريد الإلكتروني<input className="input" name="email" type="email" required placeholder="name@example.com"/></label><label className="label">العمر<input className="input" name="age" type="number" min="12" max="80" placeholder="اختياري"/></label><label className="label wide">المدينة / المنطقة<input className="input" name="city" placeholder="مثال: مصياف"/></label></div></div>
        <div data-step="1" hidden={step!==1}><div className="form-grid two"><label className="label">الاختصاص أو المهارة<input className="input" name="specialization" placeholder="تصميم، تصوير، تنظيم، تمريض..."/></label><label className="label">الفريق المفضل<select className="input" name="preferred_team" defaultValue="غير محدد"><option>غير محدد</option><option>مكتب المؤثرات الإعلامية والتمكين البشري</option><option>فريق الدراسات العامة</option><option>فريق الخدمات الميدانية</option><option>فريق التبرعات</option></select></label><label className="label wide">خبرات سابقة<textarea className="textarea" name="experience" placeholder="اختياري — اذكر أي تجربة أو مهارة قد تفيد الفريق"/></label></div><div className="form-tip"><HeartHandshake size={22}/><p>لا تقلق إذا لم تكن لديك خبرة تطوعية سابقة. الأهم أن تذكر مهاراتك الحقيقية وما تستطيع الالتزام به.</p></div></div>
        <div data-step="2" hidden={step!==2}><label className="label">لماذا ترغب بالتطوع معنا؟<textarea className="textarea tall" name="motivation" required minLength={15} placeholder="حدثنا باختصار عن دافعك وما الذي تتمنى إضافته للفريق"/></label><label className="label">أوقات التفرغ<input className="input" name="availability" placeholder="مثال: مساءً، نهاية الأسبوع، يومان أسبوعياً..."/></label><div className="review-box"><MailCheck size={24}/><div><strong>قبل الإرسال</strong><p>تأكد من صحة رقم الهاتف والبريد. بعد الإرسال سيظهر الطلب مباشرة في لوحة الإدارة للمراجعة.</p></div></div></div>
        <div className="step-actions">{step>0&&<button type="button" className="btn secondary" onClick={back}><ChevronRight size={18}/> السابق</button>}<span className="step-spacer"/>{step<steps.length-1?<button type="button" className="btn" onClick={next}>التالي <ChevronLeft size={18}/></button>:<button className="btn" type="submit" disabled={loading}><Send size={18}/>{loading?'جارٍ الإرسال...':'إرسال طلب الانضمام'}</button>}</div>
      </form></div>
    </div></section>
  </main>;
}
