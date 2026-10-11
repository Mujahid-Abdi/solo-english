-- ─────────────────────────────────────────────
-- profiles table (safe to re-run)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  full_name           text not null default '',
  avatar_url          text,
  source_language     text not null default 'afaan-oromo',
  age_group           text not null default '15-plus',
  goal                text not null default 'speak-confidently',
  xp                  integer not null default 0,
  streak_days         integer not null default 0,
  longest_streak      integer not null default 0,
  lessons_completed   integer not null default 0,
  words_learned       integer not null default 0,
  daily_goal_minutes  integer not null default 10,
  created_at          timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policies before recreating (safe to re-run)
drop policy if exists "Users can view own profile"    on public.profiles;
drop policy if exists "Users can update own profile"  on public.profiles;
drop policy if exists "Users can insert own profile"  on public.profiles;
drop policy if exists "Super admin can read all profiles" on public.profiles;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Super admin can read all profiles
create policy "Super admin can read all profiles"
  on public.profiles for select
  using (
    (select email from auth.users where id = auth.uid()) = 'abdimujahid391@gmail.com'
  );

-- Auto-create profile on sign up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
