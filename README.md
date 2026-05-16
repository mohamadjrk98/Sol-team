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
- لوحة تحكم إدارية `/admin` لإضافة وتعديل وحذف بيانات الإدارة والمنسقين والمتطوعين.
- بطاقات متطوعين فاخرة تعرض الحالة، الفريق، تاريخ الانضمام، الأعمال، والإنجازات.

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
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key
ADMIN_PASSWORD=ضع_كلمة_مرور_قوية
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

## لوحة التحكم الإدارية

افتح:

```bash
/admin
```

صلاحيات اللوحة:

- إضافة متطوع أو عضو إدارة أو منسق.
- تعديل كل البيانات.
- حذف البطاقة.
- تحديد الحالة: نشط، غادر، تم فصله، إجازة، معلّق.
- تحديد الفريق: الرصد، الميداني، الإعلامي، التوعية.
- إضافة الصورة، تاريخ الانضمام، الأعمال، الإنجازات، المهارات والشهادات.

لا تعمل عمليات الحفظ والحذف إلا عند ضبط هذه المتغيرات في Vercel:

```env
ADMIN_PASSWORD=كلمة_مرور_قوية
SUPABASE_SERVICE_ROLE_KEY=secret_service_role_key
```

## ملاحظات مهمة

- لا تضع `SUPABASE_SERVICE_ROLE_KEY` داخل كود الموقع أو ضمن أي متغير يبدأ بـ `NEXT_PUBLIC`.
- المفتاح السري يوضع فقط في Vercel Environment Variables.
- الصورة الجماعية موجودة في `public/team-banner.jpg`.


## رفع الصور من لوحة التحكم

تم إضافة رفع صورة المتطوع مباشرة من الجهاز عبر Supabase Storage.

المتطلبات:

1. في Vercel أضف المتغيرات التالية:

```env
ADMIN_PASSWORD=كلمة_مرور_قوية
SUPABASE_SERVICE_ROLE_KEY=ضع_هنا_مفتاح_sb_secret
NEXT_PUBLIC_SUPABASE_URL=رابط_مشروع_Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=المفتاح_العام
```

2. في Supabase شغّل ملف:

```bash
supabase/schema.sql
```

سيتم إنشاء Bucket باسم:

```text
volunteer-photos
```

القيود:
- الحجم الأقصى للصورة: 2MB
- الأنواع المقبولة: JPG, PNG, WEBP
- يتم حفظ رابط الصورة تلقائياً داخل بطاقة المتطوع بعد الضغط على حفظ البيانات.
