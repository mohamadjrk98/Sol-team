create extension if not exists "pgcrypto";

create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  role text not null,
  hierarchy_level text not null check (hierarchy_level in ('board','coordinator','volunteer')),
  department text,
  team_name text,
  position_rank integer not null default 100,
  specialization text,
  joined_year integer,
  location text,
  age integer,
  avatar_url text,
  bio text,
  motivation text,
  skills text[] default '{}',
  achievements text[] default '{}',
  works text[] default '{}',
  certificates text[] default '{}',
  social_links jsonb default '{}',
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists workshop_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  phone text,
  message text,
  created_at timestamptz default now()
);

create table if not exists initiatives (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  status text not null check (status in ('completed','in_progress','planned')),
  category text not null,
  date date not null,
  location text,
  image_url text,
  team text,
  created_at timestamptz default now()
);

create table if not exists impact_metrics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value integer not null default 0,
  suffix text default '',
  description text,
  created_at timestamptz default now()
);

alter table volunteers enable row level security;
alter table workshop_waitlist enable row level security;
alter table initiatives enable row level security;
alter table impact_metrics enable row level security;

drop policy if exists "Public can read volunteers" on volunteers;
create policy "Public can read volunteers" on volunteers for select using (true);

drop policy if exists "Public can read initiatives" on initiatives;
create policy "Public can read initiatives" on initiatives for select using (true);

drop policy if exists "Public can read impact metrics" on impact_metrics;
create policy "Public can read impact metrics" on impact_metrics for select using (true);

drop policy if exists "Public can join waitlist" on workshop_waitlist;
create policy "Public can join waitlist" on workshop_waitlist for insert with check (true);

insert into volunteers (slug, full_name, role, hierarchy_level, department, team_name, position_rank, specialization, joined_year, location, bio, motivation, skills, achievements, works, is_featured)
values
('chairperson', 'اسم رئيس مجلس الإدارة', 'رئيس مجلس الإدارة', 'board', 'الإدارة', null, 1, 'إدارة العمل التطوعي', 2025, 'مصياف - سوريا', 'يقود الرؤية العامة لفريق أبناء الأرض التطوعي ويتابع تنفيذ الخطة العامة للفريق.', 'أمل ينمو وأثر يبقى؛ نعمل لنترك أثراً منظماً ومستداماً في المجتمع.', array['القيادة','التخطيط','إدارة الفريق','بناء الشراكات'], array['المساهمة في تأسيس الفريق بتاريخ 25/1/2025.','وضع الهيكل التنظيمي الأولي للفريق.'], array['متابعة اجتماعات الإدارة.','تنسيق الخطط العامة.','تمثيل الفريق أمام الشركاء.'], true),
('media-coordinator', 'اسم منسق الفريق الإعلامي', 'منسق الفريق الإعلامي', 'coordinator', 'المنسقون', 'الفريق الإعلامي', 10, 'إعلام وتوثيق', 2025, 'مصياف - سوريا', 'يتابع توثيق الأنشطة وإدارة المحتوى البصري والنصي الخاص بالفريق.', 'التوثيق يحفظ أثر المتطوعين ويجعل رسالتهم تصل بشكل أوضح.', array['التصوير','كتابة المحتوى','إدارة وسائل التواصل','تنظيم الأرشيف'], array['إعداد خطة نشر للأنشطة.','توثيق مبادرات الفريق الأولى.'], array['نشر أخبار الفريق.','تنسيق المصممين والمصورين.','حفظ أرشيف الصور.'], true),
('field-volunteer', 'اسم متطوع ميداني', 'متطوع في الفريق الميداني', 'volunteer', 'المتطوعون', 'الفريق الميداني', 30, 'عمل ميداني', 2025, 'مصياف - سوريا', 'يساهم في تنفيذ الأنشطة على الأرض والمساعدة في تنظيم الفعاليات.', 'أؤمن أن العمل الصغير إذا استمر يتحول إلى أثر كبير.', array['العمل الجماعي','تنظيم الفعاليات','التواصل','المبادرة'], array['المشاركة في تجهيز أنشطة الفريق.','المساعدة في الأعمال اللوجستية.'], array['دعم الحملات الميدانية.','مساعدة المنسقين.','استقبال المشاركين في الأنشطة.'], true)
on conflict (slug) do update set
  full_name = excluded.full_name,
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
  is_featured = excluded.is_featured;

insert into initiatives (slug, title, excerpt, content, status, category, date, location, image_url, team)
values
('rain-day-field-activity', 'نشاط ميداني تطوعي في يوم ماطر', 'توثيق حضور الفريق بروح جماعية عالية وتنظيم ميداني رغم ظروف الطقس.', 'عمل المتطوعون على تنظيم النشاط الميداني وتوثيق الحضور، مع توزيع الأدوار بين الفريق الميداني والإعلامي للحفاظ على سير العمل بشكل منظم.', 'completed', 'عمل ميداني', '2025-01-25', 'مصياف', '/team-banner.jpg', 'الفريق الميداني'),
('volunteer-training-waitlist', 'التحضير لورشة تدريب المتطوعين', 'تجهيز قائمة انتظار للمهتمين بالانضمام عند إطلاق أول ورشة تدريبية.', 'حالياً لا توجد ورشة مفتوحة، لكن يتم جمع البريد الإلكتروني للمهتمين حتى يتم إشعارهم عند إطلاق ورشة تدريب المتطوعين القادمة.', 'in_progress', 'تدريب وتنظيم', '2025-02-10', 'أونلاين / مصياف', '/logo.png', 'فريق التوعية'),
('media-archive-project', 'أرشفة الصور والأنشطة الإعلامية', 'تنظيم صور الفريق ومحتوى الأنشطة لاستخدامها في الموقع ووسائل التواصل.', 'يعمل الفريق الإعلامي على بناء أرشيف بصري مرتب يساعد في توثيق الأثر وإظهار جهود المتطوعين بشكل احترافي.', 'in_progress', 'إعلام وتوثيق', '2025-02-18', 'مصياف', '/team-banner.jpg', 'الفريق الإعلامي')
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  category = excluded.category,
  date = excluded.date,
  location = excluded.location,
  image_url = excluded.image_url,
  team = excluded.team;

insert into impact_metrics (label, value, suffix, description)
values
('متطوع/ة', 27, '', 'عدد المتطوعين المنظمين ضمن الفريق حتى الآن.'),
('فرق اختصاصية', 4, '', 'الرصد، الميداني، الإعلامي، والتوعية.'),
('مبادرات موثقة', 6, '+', 'أعمال ومبادرات قابلة للتوثيق على الموقع.'),
('ساعات تطوعية', 180, '+', 'تقدير أولي لساعات العمل التطوعي الجماعي.'),
('مستفيدين', 450, '+', 'تقدير أولي للأشخاص الذين وصلتهم المبادرات والخدمات.');
