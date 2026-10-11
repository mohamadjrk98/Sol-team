create table if not exists public.volunteer_registration_requests (
 id uuid primary key default gen_random_uuid(),
 full_name text not null, phone text, team_name text not null, role text not null,
 specialization text, avatar_path text not null, consent boolean not null,
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 volunteer_slug text, created_at timestamptz not null default now(), reviewed_at timestamptz
);
alter table public.volunteer_registration_requests enable row level security;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('volunteer-registration-private','volunteer-registration-private',false,2097152,ARRAY['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false;
