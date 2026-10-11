'use client';
import {useState, type FormEvent} from 'react';
export default function RegistrationPage(){
 const [busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');
 try{const res=await fetch('/api/volunteer-registration',{method:'POST',body:new FormData(e.currentTarget)});const data=await res.json();if(!res.ok)throw new Error(data.error||'تعذر الإرسال');setDone(true)}catch(e){setError(e instanceof Error?e.message:'تعذر الإرسال')}finally{setBusy(false)}}
 return <main className="sol-private-intake sol-warm-intake" dir="rtl"><div className="sol-private-box sol-warm-box">
 <div className="sol-warm-eyebrow">💚 إلى أصحاب القلوب التي تصنع الأثر</div>
 <h1>لأنك جزء من الحكاية…<br/>وجودك بيصنع الفرق</h1>
 <p className="sol-warm-intro">كل خطوة خير تركت أثراً، وكل ساعة من وقتك كانت سبباً بابتسامة أو أمل. وجودك معنا مو مجرد اسم ضمن فريق، بل جزء من عائلة اجتمعت على المحبة والعطاء.</p>
 <p className="sol-warm-note">اليوم منحب نتعرف عليك أكتر، ونوثّق حضورك ضمن عائلة <strong>أبناء الأرض التطوعية</strong>. خصّص دقيقتين لتعبئة بياناتك، والباقي علينا 🌿</p>
 {done?<div className="sol-warm-success" role="status"><div className="sol-warm-heart">💚</div><h2>وصلتنا بياناتك… وشكراً من القلب!</h2><p>وجودك معنا قيمة كبيرة. رح تتم مراجعة بياناتك من الإدارة، وبعد الموافقة يتم تجهيز بطاقة عضويتك.</p><strong>مع بعض، الأثر بيكبر 🌱</strong></div>:<form onSubmit={submit}>
 <div className="sol-warm-section-title">خلّينا نتعرّف عليك ✨</div>
 <label>اسمك الكامل باللغة الإنجليزية <span className="sol-warm-required">*</span><input name="full_name" required minLength={5} maxLength={120} pattern="[A-Za-z][A-Za-z .\x27-]*[A-Za-z]" title="اكتب الاسم باللغة الإنجليزية فقط" placeholder="مثال: Sidra Mohammad" autoComplete="name" dir="ltr"/></label>
 <label>رقم للتواصل معك (اختياري)<input name="phone" type="tel" maxLength={30} placeholder="رقم الهاتف" autoComplete="tel"/></label>
 <label>بأي فريق عم تترك بصمتك؟ <span className="sol-warm-required">*</span><select name="team_name" required defaultValue=""><option value="" disabled>اختَر فريقك</option>{['مكتب المؤثرات الإعلامية والتمكين البشري','فريق الدراسات العامة','فريق الخدمات الميدانية','فريق التبرعات','غير محدد بعد'].map(t=><option key={t}>{t}</option>)}</select></label>
 <label>شو صفتك التطوعية؟ <span className="sol-warm-required">*</span><select name="role" required defaultValue=""><option value="" disabled>اختَر صفتك التطوعية</option>{['متطوع','منسق','إدارة','غير ذلك'].map(role=><option key={role} value={role}>{role}</option>)}</select></label>
 <div className="sol-warm-section-title">صورتك… لتكون بطاقتك أقرب إلك 📸</div>
 <p className="sol-warm-helper">اختَر صورة واضحة لوجهك، ويفضّل بخلفية بسيطة.</p>
 <label>الصورة الشخصية <span className="sol-warm-required">*</span><input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" required/><small>JPG أو PNG أو WEBP — الحجم الأقصى 2 ميغابايت</small></label>
 <label className="sol-private-consent"><input name="consent" type="checkbox" value="yes" required/><span>أوافق على حفظ بياناتي وصورتي واستخدامهما لإعداد بطاقة عضوية، وأعلم أن البطاقة قد تُعرض ضمن دليل المتطوعين بعد موافقة الإدارة.</span></label>
 {error&&<p role="alert" className="sol-private-error">{error}</p>}<button type="submit" disabled={busy}>{busy?'عم نستقبل بياناتك…':'تأكيد بياناتي بكل محبة 💚'}</button>
 <p className="sol-warm-footer">شكراً لأنك اخترت تكون جزءاً من الخير 🌿</p>
 </form>}</div></main>
}
