# فريق أبناء الأرض التطوعي

موقع Next.js عربي لفريق أبناء الأرض التطوعي، جاهز للنشر على Vercel والربط مع Supabase.

## الهوية
- الاسم: فريق أبناء الأرض التطوعي
- تاريخ التأسيس: 25/1/2025
- الشعار: أمل ينمو و أثر يبقى
- الأقسام: الإدارة، المنسقون، المتطوعون
- الفرق: فريق الرصد، الفريق الميداني، الفريق الإعلامي، فريق التوعية

## الصفحات
- `/` الصفحة الرئيسية
- `/volunteers` عرض المتطوعين حسب التراتبية
- `/volunteers/[slug]` صفحة سيرة ذاتية لكل متطوع
- `/join` صفحة الانضمام وقائمة انتظار الورشات
- `/admin` لوحة إضافة أو تعديل المتطوعين

## متغيرات Vercel
أضف هذه المتغيرات في Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eidnhzdggvocspaggmmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ضع_هنا_publishable_key
ADMIN_PASSWORD=كلمة_مرور_لوحة_الإدارة
SUPABASE_SERVICE_ROLE_KEY=ضع_هنا_service_role_key_ولا_تشاركه
```

ملاحظة: `SUPABASE_SERVICE_ROLE_KEY` مطلوب فقط للوحة `/admin`. لا تضعه أبداً في كود ظاهر أو متغير يبدأ بـ `NEXT_PUBLIC`.

## تحديث قاعدة البيانات
افتح Supabase ثم SQL Editor، وانسخ كامل محتوى:

```bash
supabase/schema.sql
```

ثم اضغط Run.

## رفع التعديلات من Termux إلى GitHub
بعد تعديل الملفات داخل مجلد المشروع:

```bash
cd ~/storage/downloads/abnaa-land
git status
git add .
git commit -m "Update team identity and join page"
git push
```

بعد الـ push، Vercel سيعمل Deploy تلقائياً.
