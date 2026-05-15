# فريق أبناء الأرض التطوعي — Next.js + Supabase

مشروع موقع احترافي لفريق أبناء الأرض التطوعي، جاهز للرفع على GitHub والتشغيل على Vercel مع قاعدة بيانات Supabase.

## ما الجديد في هذه النسخة

- بانر رئيسي بصورة جماعية للفريق.
- هوية بصرية مستوحاة من شعار الفريق: أخضر، أصفر، ودرجات ترابية.
- شعار الفريق: **أمل ينمو و أثر يبقى**.
- صفحة أعمال ومدونة: `/blog`.
- صفحات تفاصيل لكل مبادرة: `/blog/[slug]`.
- صفحة الأعمال قيد التنفيذ: `/projects`.
- صفحة إحصائيات وتأثير مع Charts: `/impact`.
- صفحة انضم إلينا: `/join` مع نموذج قائمة انتظار الورشات.
- قسم الهيكل التنظيمي والفرق: الإدارة، المنسقون، المتطوعون، فريق الرصد، الفريق الميداني، الفريق الإعلامي، فريق التوعية.
- قسم المتطوعين وصفحة CV لكل متطوع.

## التشغيل المحلي

```bash
npm install
npm run dev
```

افتح:

```bash
http://localhost:3000
```

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` وضع القيم:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_or_anon_key
SUPABASE_SERVICE_ROLE_KEY=optional_for_admin_insert
```

## Supabase

افتح Supabase → SQL Editor، وانسخ محتوى:

```bash
supabase/schema.sql
```

ثم اضغط Run.

## تحديث GitHub من Termux

بعد فك الضغط واستبدال ملفات المشروع داخل `abnaa-land`:

```bash
cd ~/storage/downloads/abnaa-land
git status
git add .
git commit -m "Professional website update"
git push
```

بعد `git push` سيعمل Vercel Deploy تلقائياً.

## ملاحظات مهمة

- صفحة `/admin` لا تزال بحاجة لحماية بكلمة مرور أو تسجيل دخول قبل الاستخدام الحقيقي.
- المفاتيح السرية الخاصة بـ Supabase لا تضعها في المتصفح أو داخل `NEXT_PUBLIC`.
- الصورة الجماعية موجودة في `public/team-banner.jpg`.
