create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'volunteer-photos',
  'volunteer-photos',
  true,
  2097152,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  role text not null,
  hierarchy_level text not null check (hierarchy_level in ('board','coordinator','volunteer')),
  department text,
  team_name text,
  team_names text[] not null default '{}',
  position_rank integer not null default 100,
  specialization text,
  joined_year integer,
  joined_date date,
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
  volunteer_status text not null default 'active' check (volunteer_status in ('active','left','dismissed','vacation','paused')),
  exit_reason text,
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


alter table volunteers add column if not exists team_names text[] not null default '{}';
alter table volunteers add column if not exists joined_date date;
alter table volunteers add column if not exists volunteer_status text not null default 'active';
alter table volunteers add column if not exists exit_reason text;
do $$ begin
  alter table volunteers add constraint volunteers_status_check check (volunteer_status in ('active','left','dismissed','vacation','paused'));
exception when duplicate_object then null;
end $$;

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

drop policy if exists "Public can read volunteer photos" on storage.objects;
create policy "Public can read volunteer photos" on storage.objects
for select using (bucket_id = 'volunteer-photos');


insert into volunteers (slug, full_name, role, hierarchy_level, department, team_name, position_rank, specialization, joined_year, joined_date, location, bio, motivation, skills, achievements, works, volunteer_status, is_featured)
values
('chairperson', 'اسم رئيس مجلس الإدارة', 'رئيس مجلس الإدارة', 'board', 'الإدارة', null, 1, 'إدارة العمل التطوعي', 2025, '2025-01-25', 'مصياف - سوريا', 'يقود الرؤية العامة لفريق أبناء الأرض التطوعي ويتابع تنفيذ الخطة العامة للفريق.', 'أمل ينمو وأثر يبقى؛ نعمل لنترك أثراً منظماً ومستداماً في المجتمع.', array['القيادة','التخطيط','إدارة الفريق','بناء الشراكات'], array['المساهمة في تأسيس الفريق بتاريخ 25/1/2025.','وضع الهيكل التنظيمي الأولي للفريق.'], array['متابعة اجتماعات الإدارة.','تنسيق الخطط العامة.','تمثيل الفريق أمام الشركاء.'], 'active', true),
('media-coordinator', 'اسم منسق مكتب المؤثرات الإعلامية والتمكين البشري', 'منسق مكتب المؤثرات الإعلامية والتمكين البشري', 'coordinator', 'المنسقون', 'مكتب المؤثرات الإعلامية والتمكين البشري', 10, 'إعلام وتوثيق', 2025, '2025-01-25', 'مصياف - سوريا', 'يتابع توثيق الأنشطة وإدارة المحتوى البصري والنصي الخاص بالفريق.', 'التوثيق يحفظ أثر المتطوعين ويجعل رسالتهم تصل بشكل أوضح.', array['التصوير','كتابة المحتوى','إدارة وسائل التواصل','تنظيم الأرشيف'], array['إعداد خطة نشر للأنشطة.','توثيق مبادرات الفريق الأولى.'], array['نشر أخبار الفريق.','تنسيق المصممين والمصورين.','حفظ أرشيف الصور.'], 'active', true),
('field-volunteer', 'اسم متطوع ميداني', 'متطوع في فريق الخدمات الميدانية', 'volunteer', 'المتطوعون', 'فريق الخدمات الميدانية', 30, 'عمل ميداني', 2025, '2025-01-25', 'مصياف - سوريا', 'يساهم في تنفيذ الأنشطة على الأرض والمساعدة في تنظيم الفعاليات.', 'أؤمن أن العمل الصغير إذا استمر يتحول إلى أثر كبير.', array['العمل الجماعي','تنظيم الفعاليات','التواصل','المبادرة'], array['المشاركة في تجهيز أنشطة الفريق.','المساعدة في الأعمال اللوجستية.'], array['دعم الحملات الميدانية.','مساعدة المنسقين.','استقبال المشاركين في الأنشطة.'], 'active', true)
on conflict (slug) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  hierarchy_level = excluded.hierarchy_level,
  department = excluded.department,
  team_name = excluded.team_name,
  position_rank = excluded.position_rank,
  specialization = excluded.specialization,
  joined_year = excluded.joined_year,
  joined_date = excluded.joined_date,
  location = excluded.location,
  bio = excluded.bio,
  motivation = excluded.motivation,
  skills = excluded.skills,
  achievements = excluded.achievements,
  works = excluded.works,
  volunteer_status = excluded.volunteer_status,
  is_featured = excluded.is_featured;

update volunteers set team_names = case when team_name is not null and btrim(team_name) <> '' then array[team_name]::text[] else '{}'::text[] end where cardinality(team_names) = 0;

insert into initiatives (slug, title, excerpt, content, status, category, date, location, image_url, team)
values
('rain-day-field-activity', 'نشاط ميداني تطوعي في يوم ماطر', 'توثيق حضور الفريق بروح جماعية عالية وتنظيم ميداني رغم ظروف الطقس.', 'عمل المتطوعون على تنظيم النشاط الميداني وتوثيق الحضور، مع توزيع الأدوار بين فريق الخدمات الميدانية والإعلامي للحفاظ على سير العمل بشكل منظم.', 'completed', 'عمل ميداني', '2025-01-25', 'مصياف', '/team-banner.jpg', 'فريق الخدمات الميدانية'),
('volunteer-training-waitlist', 'التحضير لورشة تدريب المتطوعين', 'تجهيز قائمة انتظار للمهتمين بالانضمام عند إطلاق أول ورشة تدريبية.', 'حالياً لا توجد ورشة مفتوحة، لكن يتم جمع البريد الإلكتروني للمهتمين حتى يتم إشعارهم عند إطلاق ورشة تدريب المتطوعين القادمة.', 'in_progress', 'تدريب وتنظيم', '2025-02-10', 'أونلاين / مصياف', '/logo.png', 'مكتب المؤثرات الإعلامية والتمكين البشري'),
('media-archive-project', 'أرشفة الصور والأنشطة الإعلامية', 'تنظيم صور الفريق ومحتوى الأنشطة لاستخدامها في الموقع ووسائل التواصل.', 'يعمل مكتب المؤثرات الإعلامية والتمكين البشري على بناء أرشيف بصري مرتب يساعد في توثيق الأثر وإظهار جهود المتطوعين بشكل احترافي.', 'in_progress', 'إعلام وتوثيق', '2025-02-18', 'مصياف', '/team-banner.jpg', 'مكتب المؤثرات الإعلامية والتمكين البشري')
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

-- === Platform upgrade: Dashboard, initiatives management, join applications ===
create table if not exists join_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  phone text,
  age integer,
  city text,
  specialization text,
  preferred_team text,
  motivation text,
  availability text,
  experience text,
  status text not null default 'new' check (status in ('new','reviewing','accepted','rejected','contacted')),
  admin_notes text,
  created_at timestamptz default now()
);

alter table initiatives add column if not exists beneficiaries_count integer default 0;
alter table initiatives add column if not exists volunteer_hours integer default 0;
alter table initiatives add column if not exists progress_percent integer default 0;
alter table initiatives add column if not exists is_featured boolean default false;

alter table join_applications enable row level security;
drop policy if exists "Public can submit join applications" on join_applications;
create policy "Public can submit join applications" on join_applications for insert with check (true);

-- migrate old simple waitlist if it exists
insert into join_applications (email, full_name, phone, status)
select email, full_name, phone, 'new' from workshop_waitlist
where email is not null
on conflict (email) do nothing;

update initiatives set beneficiaries_count = 450, volunteer_hours = 180, progress_percent = 100, is_featured = true where slug = 'rain-day-field-activity';
update initiatives set beneficiaries_count = 0, volunteer_hours = 12, progress_percent = 60, is_featured = true where slug = 'volunteer-training-waitlist';
update initiatives set beneficiaries_count = 0, volunteer_hours = 35, progress_percent = 70, is_featured = false where slug = 'media-archive-project';

-- === Weekly star voting ===
create table if not exists weekly_star_votes (
  id uuid primary key default gen_random_uuid(),
  volunteer_slug text not null references volunteers(slug) on delete cascade,
  voter_name text,
  created_at timestamptz default now()
);

create index if not exists weekly_star_votes_slug_idx on weekly_star_votes(volunteer_slug);
create index if not exists weekly_star_votes_created_idx on weekly_star_votes(created_at);

alter table weekly_star_votes enable row level security;
-- Voting is handled through server routes using SUPABASE_SERVICE_ROLE_KEY.

-- === General site settings managed from the admin panel ===
create table if not exists site_settings (
  id text primary key default 'main',
  team_name text not null,
  short_name text not null,
  slogan text not null,
  description text not null default '',
  location text not null default '',
  phone text not null default '',
  instagram text not null default '',
  founded_at text not null default '',
  meeting_text text not null default '',
  join_intro text not null default ''
);
alter table site_settings enable row level security;
drop policy if exists "Public can read site settings" on site_settings;
create policy "Public can read site settings" on site_settings for select using (true);
insert into site_settings (id,team_name,short_name,slogan,description,location,phone,instagram,founded_at,meeting_text,join_intro)
values ('main','فريق أبناء الأرض التطوعي','أبناء الأرض','أمل ينمو و أثر يبقى','فريق تطوعي يسعى للمساهمة في بناء مجتمع متماسك ومزدهر من خلال تقديم خدمات اجتماعية وتنموية تركز على تعزيز جودة الحياة.','مصياف - سوريا','0988 260 910','s.o.l.team','25/1/2025','الاجتماع العام: الخميس الساعة 5','نبحث عن أشخاص يؤمنون بالأثر والالتزام والعمل الجماعي. أرسل طلبك وسيتواصل معك الفريق عند مراجعته.')
on conflict (id) do nothing;

-- === Volunteer accounts and work hours ===
create table if not exists volunteer_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  volunteer_id uuid not null unique references volunteers(id) on delete cascade,
  username text not null,
  role text not null default 'volunteer'
    check (role in ('volunteer','coordinator')),
  coordinator_teams text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists volunteer_accounts_username_unique
  on volunteer_accounts (lower(username));

create index if not exists volunteer_accounts_volunteer_idx
  on volunteer_accounts(volunteer_id);

create table if not exists volunteer_hours (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  team_name text not null,
  work_date date not null default current_date,
  hours numeric(6,2) not null check (hours > 0 and hours <= 24),
  description text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  reviewed_by uuid references volunteer_accounts(user_id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now()
);

create index if not exists volunteer_hours_volunteer_idx
  on volunteer_hours(volunteer_id);

create index if not exists volunteer_hours_team_status_idx
  on volunteer_hours(team_name,status);

alter table volunteer_accounts enable row level security;
alter table volunteer_hours enable row level security;

-- Authenticated volunteer can read their own account.
drop policy if exists "account_read_own" on volunteer_accounts;
create policy "account_read_own"
on volunteer_accounts
for select
to authenticated
using (user_id = auth.uid());

-- Volunteer can read only their own hour records.
drop policy if exists "volunteer_read_own_hours" on volunteer_hours;
create policy "volunteer_read_own_hours"
on volunteer_hours
for select
to authenticated
using (
  volunteer_id = (
    select va.volunteer_id
    from volunteer_accounts va
    where va.user_id = auth.uid()
      and va.active = true
  )
);

-- Volunteer can submit hours only for a team they belong to.
drop policy if exists "volunteer_insert_own_hours" on volunteer_hours;
create policy "volunteer_insert_own_hours"
on volunteer_hours
for insert
to authenticated
with check (
  status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and rejection_reason is null
  and exists (
    select 1
    from volunteer_accounts va
    join volunteers v on v.id = va.volunteer_id
    where va.user_id = auth.uid()
      and va.active = true
      and va.volunteer_id = volunteer_hours.volunteer_id
      and volunteer_hours.team_name = any(v.team_names)
  )
);

-- Coordinator can read pending/history records for assigned teams.
drop policy if exists "coordinator_read_team_hours" on volunteer_hours;
create policy "coordinator_read_team_hours"
on volunteer_hours
for select
to authenticated
using (
  exists (
    select 1
    from volunteer_accounts va
    where va.user_id = auth.uid()
      and va.active = true
      and va.role = 'coordinator'
      and volunteer_hours.team_name = any(va.coordinator_teams)
  )
);

-- Coordinator can review pending records only for assigned teams.
drop policy if exists "coordinator_review_team_hours" on volunteer_hours;
create policy "coordinator_review_team_hours"
on volunteer_hours
for update
to authenticated
using (
  status = 'pending'
  and exists (
    select 1
    from volunteer_accounts va
    where va.user_id = auth.uid()
      and va.active = true
      and va.role = 'coordinator'
      and volunteer_hours.team_name = any(va.coordinator_teams)
  )
)
with check (
  status in ('approved','rejected')
  and reviewed_by = auth.uid()
  and reviewed_at is not null
  and exists (
    select 1
    from volunteer_accounts va
    where va.user_id = auth.uid()
      and va.active = true
      and va.role = 'coordinator'
      and volunteer_hours.team_name = any(va.coordinator_teams)
  )
);

-- Protect the original hour request while a coordinator reviews it.
create or replace function protect_volunteer_hour_content()
returns trigger
language plpgsql
as $$
begin
  if new.volunteer_id is distinct from old.volunteer_id
     or new.team_name is distinct from old.team_name
     or new.work_date is distinct from old.work_date
     or new.hours is distinct from old.hours
     or new.description is distinct from old.description
     or new.created_at is distinct from old.created_at then
    raise exception 'Volunteer hour content cannot be changed during review';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_volunteer_hour_content_trigger
on volunteer_hours;

create trigger protect_volunteer_hour_content_trigger
before update on volunteer_hours
for each row
execute function protect_volunteer_hour_content();
