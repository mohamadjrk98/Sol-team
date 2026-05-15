# موقع فريق أبناء لأرض — Next.js + Supabase + Vercel

مشروع جاهز للرفع على GitHub ثم التشغيل على Vercel مع قاعدة بيانات Supabase.

## المحتويات

- صفحة رئيسية عربية RTL.
- صفحة متطوعين `/volunteers`.
- صفحة شخصية لكل متطوع `/volunteers/[slug]` على شكل سيرة ذاتية.
- لوحة إضافة/تعديل متطوع بسيطة `/admin` محمية بكلمة مرور.
- اتصال جاهز مع Supabase.
- ملف SQL لإنشاء جدول المتطوعين وإضافة بيانات تجريبية.

## التشغيل المحلي

```bash
npm install
cp .env.example .env.local
npm run dev
```

افتح:

```text
http://localhost:3000
```

## تجهيز Supabase

1. افتح مشروع Supabase.
2. ادخل إلى **SQL Editor**.
3. انسخ محتوى الملف:

```text
supabase/schema.sql
```

4. شغله مرة واحدة.
5. من Project Settings > API انسخ القيم التالية:
   - Project URL
   - anon public key
   - service_role key

## متغيرات البيئة المطلوبة في Vercel

ضع هذه القيم في Vercel من:

Project Settings → Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD=ضع-كلمة-مرور-قوية
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

> مهم: لا تضع `SUPABASE_SERVICE_ROLE_KEY` في أي ملف منشور للناس، فقط في Environment Variables داخل Vercel.

## الرفع على GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## النشر على Vercel

1. افتح Vercel.
2. اختر Add New Project.
3. اربط مستودع GitHub.
4. أضف Environment Variables المذكورة أعلاه.
5. اضغط Deploy.

## إضافة متطوع جديد

بعد النشر، افتح:

```text
https://your-domain.vercel.app/admin
```

أدخل كلمة مرور الإدارة التي وضعتها في `ADMIN_PASSWORD` ثم أضف بيانات المتطوع.

## تعديل التصميم

التصميم موجود في:

```text
app/globals.css
```

## ملاحظات

- الموقع يعمل ببيانات تجريبية حتى قبل ربط Supabase.
- بعد ربط Supabase، سيتم جلب المتطوعين من جدول `volunteers`.
- لوحة الإدارة تستخدم API server route، لذلك مفتاح service role لا يظهر في المتصفح.
