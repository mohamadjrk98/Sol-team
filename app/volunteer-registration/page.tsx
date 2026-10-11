'use client';
import {useState, type FormEvent} from 'react';
export default function RegistrationPage(){
 const [busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');
 try{const res=await fetch('/api/volunteer-registration',{method:'POST',body:new FormData(e.currentTarget)});const data=await res.json();if(!res.ok)throw new Error(data.error||'تعذر الإرسال');setDone(true)}catch(e){setError(e instanceof Error?e.message:'تعذر الإرسال')}finally{setBusy(false)}}
 return <main className="sol-private-intake" dir="rtl"><div className="sol-private-box"><span>استمارة بيانات المتطوع</span><h1>تحديث بيانات العضوية التطوعية</h1><p>يرجى تعبئة المعلومات بدقة. ستُستخدم البيانات والصورة لإعداد سجل وبطاقة عضوية بعد مراجعة الإدارة.</p>{done?<strong>تم استلام بياناتك بنجاح، شكراً لتعاونك.</strong>:<form onSubmit={submit}>
 <label>الاسم الكامل<input name="full_name" required maxLength={120}/></label>
 <label>رقم الهاتف (اختياري)<input name="phone" type="tel" maxLength={30}/></label>
 <label>المكتب أو الفريق<select name="team_name" required defaultValue=""><option value="" disabled>اختر الفريق</option>{['مكتب المؤثرات الإعلامية والتمكين البشري','فريق الدراسات العامة','فريق الخدمات الميدانية','فريق التبرعات','غير محدد بعد'].map(t=><option key={t}>{t}</option>)}</select></label>
 <label>الصفة التطوعية<input name="role" required maxLength={80} defaultValue="متطوع"/></label>
 <label>الاختصاص (اختياري)<input name="specialization" maxLength={120}/></label>
 <label>الصورة الشخصية (JPG / PNG / WEBP، حتى 2MB)<input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" required/></label>
 <label className="sol-private-consent"><input name="consent" type="checkbox" value="yes" required/>أوافق على حفظ بياناتي وصورتي واستخدامهما لإعداد بطاقة عضوية، وأعلم أن البطاقة قد تُعرض ضمن دليل المتطوعين بعد موافقة الإدارة.</label>
 {error&&<p role="alert" className="sol-private-error">{error}</p>}<button type="submit" disabled={busy}>{busy?'جاري الإرسال...':'إرسال البيانات'}</button></form>}</div></main>
}
