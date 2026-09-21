-- Tuana — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run.
-- It is safe to re-run (everything is "if not exists" / "or replace").
--
-- Model: every editable document keeps its full JSON in a `data` column and
-- a few columns are duplicated out for filtering/sorting. The app talks to
-- these tables ONLY from the server with the service-role key; the RLS
-- policies below exist so that a leaked anon key can still never write and
-- can only read what the public storefront is allowed to see.

-- ─────────────────────────── profiles (roles) ───────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

-- Every new auth user gets a profile (role = customer). Promote an admin with:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────── catalog ───────────────────────────
create table if not exists public.categories (
  id          text primary key,
  slug        text not null unique,
  sort        integer not null default 0,
  data        jsonb not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id          text primary key,
  slug        text not null unique,
  status      text not null default 'active' check (status in ('active', 'draft', 'archived')),
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists products_status_idx on public.products (status);

create table if not exists public.coupons (
  id    text primary key,
  code  text not null unique,
  data  jsonb not null
);

-- key/value documents: 'store' (settings) and 'content' (site copy + images)
create table if not exists public.site_settings (
  key         text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────── orders ───────────────────────────
create table if not exists public.orders (
  id           text primary key,
  number       text not null unique,
  customer_id  uuid references auth.users (id) on delete set null,
  email        text not null,
  status       text not null,
  total        numeric(10, 2) not null,
  data         jsonb not null,
  created_at   timestamptz not null default now()
);
create index if not exists orders_customer_idx on public.orders (customer_id);
create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists orders_created_idx on public.orders (created_at desc);

-- ─────────────────────────── row level security ───────────────────────────
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.coupons        enable row level security;
alter table public.site_settings  enable row level security;
alter table public.orders         enable row level security;

-- Public storefront can read the catalog and the site copy…
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products for select using (status = 'active');

drop policy if exists "public read site content" on public.site_settings;
create policy "public read site content" on public.site_settings for select using (key = 'content');

-- …signed-in customers can read their own profile and orders…
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "read own orders" on public.orders;
create policy "read own orders" on public.orders for select using (auth.uid() = customer_id);

-- …and nothing else. Coupons and settings have no public policy; writes have
-- no policy at all, so only the server (service-role key) can change data.

-- ─────────────────────────── storage (images) ───────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can view files in the public bucket; uploads happen server-side only.
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
