-- SOL Team 2026 safe upgrade for an EXISTING Supabase project.
-- Non-destructive: creates only the new public site settings table/policy/default row.

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
create policy "Public can read site settings"
on site_settings for select
using (true);

insert into site_settings (
  id, team_name, short_name, slogan, description, location,
  phone, instagram, founded_at, meeting_text, join_intro
)
values (
  'main',
  'فريق أبناء الأرض التطوعي',
  'أبناء الأرض',
  'أمل ينمو و أثر يبقى',
  'فريق تطوعي يسعى للمساهمة في بناء مجتمع متماسك ومزدهر من خلال تقديم خدمات اجتماعية وتنموية تركز على تعزيز جودة الحياة.',
  'مصياف - سوريا',
  '0988 260 910',
  's.o.l.team',
  '25/1/2025',
  'الاجتماع العام: الخميس الساعة 5',
  'نبحث عن أشخاص يؤمنون بالأثر والالتزام والعمل الجماعي. أرسل طلبك وسيتواصل معك الفريق عند مراجعته.'
)
on conflict (id) do nothing;
