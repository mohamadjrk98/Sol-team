-- Supabase schema for فريق أبناء الأرض التطوعي
-- Run this file in Supabase SQL Editor after every structural update.

create extension if not exists "pgcrypto";

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  role text,
  hierarchy_level text,
  department text,
  team_name text,
  position_rank integer,
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

alter table public.volunteers add column if not exists hierarchy_level text;
alter table public.volunteers add column if not exists department text;
alter table public.volunteers add column if not exists team_name text;
alter table public.volunteers add column if not exists position_rank integer;

create table if not exists public.training_waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text not null unique,
  phone text,
  created_at timestamptz not null default now()
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
alter table public.training_waitlist enable row level security;

drop policy if exists "Public read volunteers" on public.volunteers;
create policy "Public read volunteers"
on public.volunteers for select
to anon, authenticated
using (true);

drop policy if exists "Public insert waitlist" on public.training_waitlist;
create policy "Public insert waitlist"
on public.training_waitlist for insert
to anon, authenticated
with check (true);

drop policy if exists "Public update own email waitlist" on public.training_waitlist;
create policy "Public update own email waitlist"
on public.training_waitlist for update
to anon, authenticated
using (true)
with check (true);

insert into public.volunteers
(slug, full_name, role, hierarchy_level, department, team_name, position_rank, specialization, joined_year, location, age, avatar_url, bio, motivation, skills, achievements, works, certificates, social_links, is_featured)
values
('chairperson','اسم رئيس مجلس الإدارة','رئيس مجلس الإدارة','board','الإدارة',null,1,'إدارة العمل التطوعي',2025,'مصياف - سوريا',null,null,'يقود الرؤية العامة لفريق أبناء الأرض التطوعي ويتابع تنفيذ الخطة العامة للفريق.','أمل ينمو وأثر يبقى؛ نعمل لنترك أثراً منظماً ومستداماً في المجتمع.',array['القيادة','التخطيط','إدارة الفريق','بناء الشراكات'],array['المساهمة في تأسيس الفريق بتاريخ 25/1/2025.','وضع الهيكل التنظيمي الأولي للفريق.'],array['متابعة اجتماعات الإدارة.','تنسيق الخطط العامة.','تمثيل الفريق أمام الشركاء.'],array[]::text[],'{}',true),
('media-coordinator','اسم منسق الفريق الإعلامي','منسق الفريق الإعلامي','coordinator','المنسقون','الفريق الإعلامي',10,'إعلام وتوثيق',2025,'مصياف - سوريا',null,null,'يتابع توثيق الأنشطة وإدارة المحتوى البصري والنصي الخاص بالفريق.','التوثيق يحفظ أثر المتطوعين ويجعل رسالتهم تصل بشكل أوضح.',array['التصوير','كتابة المحتوى','إدارة وسائل التواصل','تنظيم الأرشيف'],array['إعداد خطة نشر للأنشطة.','توثيق مبادرات الفريق الأولى.'],array['نشر أخبار الفريق.','تنسيق المصممين والمصورين.','حفظ أرشيف الصور.'],array[]::text[],'{}',true),
('field-volunteer','اسم متطوع ميداني','متطوع في الفريق الميداني','volunteer','المتطوعون','الفريق الميداني',30,'عمل ميداني',2025,'مصياف - سوريا',null,null,'يساهم في تنفيذ الأنشطة على الأرض والمساعدة في تنظيم الفعاليات.','أؤمن أن العمل الصغير إذا استمر يتحول إلى أثر كبير.',array['العمل الجماعي','تنظيم الفعاليات','التواصل','المبادرة'],array['المشاركة في تجهيز أنشطة الفريق.','المساعدة في الأعمال اللوجستية.'],array['دعم الحملات الميدانية.','مساعدة المنسقين.','استقبال المشاركين في الأنشطة.'],array[]::text[],'{}',true)
on conflict (slug) do update set
  role = excluded.role,
  hierarchy_level = excluded.hierarchy_level,
  department = excluded.department,
  team_name = excluded.team_name,
  position_rank = excluded.position_rank,
  specialization = excluded.specialization,
  joined_year = excluded.joined_year,
  location = excluded.location,
  bio = excluded.bio,
  motivation = excluded.motivation,
  skills = excluded.skills,
  achievements = excluded.achievements,
  works = excluded.works,
  certificates = excluded.certificates,
  is_featured = excluded.is_featured;
