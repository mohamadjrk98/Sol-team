-- Supabase schema for أبناء لأرض
-- Run this file in Supabase SQL Editor before deploying on Vercel.

create extension if not exists "pgcrypto";

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  role text,
  specialization text,
  joined_year integer,
  location text,
  age integer,
  avatar_url text,
  bio text,
  motivation text,
  skills text[] not null default '{}',
  achievements text[] not null default '{}',
  works text[] not null default '{}',
  certificates text[] not null default '{}',
  social_links jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_volunteers_updated_at on public.volunteers;
create trigger set_volunteers_updated_at
before update on public.volunteers
for each row execute function public.set_updated_at();

alter table public.volunteers enable row level security;

drop policy if exists "Public read volunteers" on public.volunteers;
create policy "Public read volunteers"
on public.volunteers for select
to anon, authenticated
using (true);

-- Insert/Update/Delete are performed only by SUPABASE_SERVICE_ROLE_KEY from the server API route.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in client-side code.

insert into public.volunteers
(slug, full_name, role, specialization, joined_year, location, age, avatar_url, bio, motivation, skills, achievements, works, certificates, social_links, is_featured)
values
('ahmad-mahmoud','أحمد محمود','متطوع في فريق أبناء لأرض','هندسة بيئية',2022,'رام الله - فلسطين',24,null,'شاب طموح يهتم بالعمل البيئي والمجتمعي. انضم إلى فريق أبناء لأرض لأنه يؤمن أن العمل التطوعي هو أداة حقيقية لإحداث التغيير.','أؤمن أن كل فرد قادر على إحداث فرق، ومن خلال العمل الجماعي نستطيع بناء مستقبل أفضل لنا جميعاً.',array['إدارة المشاريع','التوعية البيئية','التصميم الجرافيكي','التواصل الفعال','العمل الجماعي'],array['قيادة حملة تنظيف في الحي بمشاركة 80 متطوعاً.','تنظيم ورشة توعية عن إعادة التدوير.','المساهمة في زراعة 300 شجرة.'],array['تنسيق المتطوعين في الفعاليات.','إعداد مواد توعوية للفريق.','متابعة مبادرات التشجير المحلية.'],array['شهادة مشاركة في برنامج القيادة الشبابية.','دورة أساسيات إدارة المشاريع التطوعية.'],'{"facebook":"#","instagram":"#","linkedin":"#"}',true),
('sara-khaled','سارة خالد','مسؤولة محتوى وتوثيق','إعلام رقمي',2023,'نابلس - فلسطين',22,null,'تعمل على توثيق أنشطة الفريق وقصص المتطوعين ونشر رسائل الفريق بأسلوب بسيط ومؤثر.','أحب أن أوصل قصص الناس الذين يعملون بصمت من أجل الأرض والمجتمع.',array['كتابة المحتوى','التصوير','إدارة وسائل التواصل','تحرير الفيديو'],array['إطلاق سلسلة قصص المتطوعين.','توثيق أكثر من 20 نشاطاً ميدانياً.','زيادة تفاعل صفحات الفريق.'],array['نشر الأخبار والصور.','إعداد مقابلات مع المتطوعين.','تنظيم أرشيف الصور والفيديو.'],array['دورة إنتاج محتوى رقمي مجتمعي.'],'{"instagram":"#","linkedin":"#"}',true),
('yousef-ali','يوسف علي','منسق فعاليات','إدارة أعمال',2024,'الخليل - فلسطين',26,null,'يساعد في التخطيط للفعاليات وتنظيم الموارد والتواصل مع الشركاء المحليين.','أرى أن التنظيم الجيد يحول الأفكار الجميلة إلى نتائج ملموسة.',array['تنظيم الفعاليات','التواصل مع الشركاء','إدارة الوقت','حل المشكلات'],array['تنظيم يوم تطوعي مفتوح.','بناء شراكات مع مبادرات محلية.','إعداد خطة تشغيل للفعاليات.'],array['تنسيق الجداول والمهام.','التواصل مع المؤسسات.','إدارة فرق العمل في الميدان.'],array['تدريب إدارة الفعاليات المجتمعية.'],'{"facebook":"#","linkedin":"#"}',true)
on conflict (slug) do nothing;
