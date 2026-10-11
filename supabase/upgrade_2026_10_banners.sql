-- Run once in Supabase SQL Editor. Non-destructive.
create table if not exists public.home_banners (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 subtitle text not null default '',
 image_url text not null,
 button_text text not null default '',
 button_url text not null default '',
 sort_order integer not null default 100,
 is_active boolean not null default true,
 created_at timestamptz not null default now()
);
alter table public.home_banners enable row level security;
drop policy if exists "Read active banners" on public.home_banners;
create policy "Read active banners" on public.home_banners for select to anon, authenticated using (is_active = true);
-- Admin writes through server-side service role; no public write policy.
