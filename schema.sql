-- Torneig Frontó Gelida 2026 · esquema de producció per Supabase
-- Executar a Supabase SQL Editor quan es creï el projecte.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'member' check (role in ('admin','referee','member')),
  member_number integer,
  is_member boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists tournament_config (
  id text primary key default '2026',
  name text not null default 'Torneig Frontó Gelida 2026',
  dates text not null default '10–13 setembre 2026',
  max_pairs integer not null default 32,
  normal_price numeric(10,2) not null default 22,
  member_price numeric(10,2) not null default 35,
  meal_price numeric(10,2) not null default 10,
  bizum_instructions text,
  dropbox_url text,
  contact_phone text,
  registration_open boolean not null default true,
  lunch_open boolean not null default true,
  merch_open boolean not null default true,
  mvp_open boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  gender text check (gender in ('male','female')),
  member_number integer,
  is_member boolean not null default false,
  created_at timestamptz not null default now(),
  unique(lower(full_name))
);

create table if not exists pairs (
  id uuid primary key default gen_random_uuid(),
  tournament_id text not null default '2026',
  seed integer,
  player1_id uuid references players(id),
  player2_id uuid references players(id),
  color text,
  status text not null default 'confirmed' check (status in ('pending','confirmed','withdrawn')),
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id text primary key,
  tournament_id text not null default '2026',
  stage text not null,
  team1_id uuid references pairs(id),
  team2_id uuid references pairs(id),
  team1_source text,
  team2_source text,
  score1 integer not null default 0,
  score2 integer not null default 0,
  status text not null default 'pending' check (status in ('pending','live','final')),
  scheduled_at text,
  court text default 'Pista 1',
  updated_at timestamptz not null default now()
);

create table if not exists tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  player1_name text not null,
  player2_name text not null,
  player1_type text not null check (player1_type in ('normal','member')),
  player2_type text not null check (player2_type in ('normal','member')),
  amount numeric(10,2) not null,
  bizum_name text,
  payment_status text not null default 'pending' check (payment_status in ('pending','bizum_sent','verified','rejected')),
  status text not null default 'pending' check (status in ('pending','accepted','waitlist','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists lunch_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  price numeric(10,2) not null default 10,
  is_open boolean not null default true
);

create table if not exists lunch_reservations (
  id uuid primary key default gen_random_uuid(),
  lunch_id uuid references lunch_events(id) on delete cascade,
  full_name text not null,
  reservation_group uuid not null default gen_random_uuid(),
  bizum_name text,
  payment_status text not null default 'pending' check (payment_status in ('pending','bizum_sent','verified','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists merch_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2),
  sizes text[],
  active boolean not null default true
);

create table if not exists merch_orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references merch_products(id),
  buyer_name text not null,
  size text,
  quantity integer not null default 1 check (quantity > 0),
  amount numeric(10,2),
  bizum_name text,
  payment_status text not null default 'pending' check (payment_status in ('pending','bizum_sent','verified','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  notice_type text default 'info',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists mvp_votes (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references profiles(id) on delete cascade,
  male_player_id uuid not null references players(id),
  female_player_id uuid not null references players(id),
  created_at timestamptz not null default now(),
  unique(member_id)
);

-- Helper per permisos d'organització
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from profiles where id = auth.uid() and role in ('admin','referee'));
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

alter table profiles enable row level security;
alter table tournament_config enable row level security;
alter table players enable row level security;
alter table pairs enable row level security;
alter table matches enable row level security;
alter table tournament_registrations enable row level security;
alter table lunch_events enable row level security;
alter table lunch_reservations enable row level security;
alter table merch_products enable row level security;
alter table merch_orders enable row level security;
alter table notices enable row level security;
alter table mvp_votes enable row level security;

-- Lectura pública del torneig
create policy "public read config" on tournament_config for select using (true);
create policy "public read players" on players for select using (true);
create policy "public read pairs" on pairs for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read lunches" on lunch_events for select using (true);
create policy "public read lunch list" on lunch_reservations for select using (true);
create policy "public read merch products" on merch_products for select using (true);
create policy "public read notices" on notices for select using (published = true);

-- Formularis públics: només INSERT. L'usuari no pot modificar ni eliminar després.
create policy "public insert tournament registration" on tournament_registrations for insert with check (true);
create policy "public insert lunch reservation" on lunch_reservations for insert with check (true);
create policy "public insert merch order" on merch_orders for insert with check (true);

-- Organització
create policy "staff read registrations" on tournament_registrations for select using (is_staff());
create policy "staff manage registrations" on tournament_registrations for update using (is_staff()) with check (is_staff());
create policy "admin delete registrations" on tournament_registrations for delete using (is_admin());
create policy "staff manage matches" on matches for all using (is_staff()) with check (is_staff());
create policy "staff manage lunches" on lunch_events for all using (is_staff()) with check (is_staff());
create policy "staff update lunch reservations" on lunch_reservations for update using (is_staff()) with check (is_staff());
create policy "admin delete lunch reservations" on lunch_reservations for delete using (is_admin());
create policy "staff manage merch products" on merch_products for all using (is_staff()) with check (is_staff());
create policy "staff read merch orders" on merch_orders for select using (is_staff());
create policy "staff update merch orders" on merch_orders for update using (is_staff()) with check (is_staff());
create policy "admin delete merch orders" on merch_orders for delete using (is_admin());
create policy "staff manage notices" on notices for all using (is_staff()) with check (is_staff());
create policy "admin manage config" on tournament_config for all using (is_admin()) with check (is_admin());
create policy "staff manage players" on players for all using (is_staff()) with check (is_staff());
create policy "staff manage pairs" on pairs for all using (is_staff()) with check (is_staff());

-- MVP: només un usuari autenticat que sigui soci pot votar, una vegada.
create policy "member insert own mvp vote" on mvp_votes for insert
with check (
  member_id = auth.uid()
  and exists(select 1 from profiles where id = auth.uid() and is_member = true)
);
create policy "member read own mvp vote" on mvp_votes for select using (member_id = auth.uid() or is_admin());

-- Realtime
alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table notices;
alter publication supabase_realtime add table lunch_reservations;

-- Dinars inicials
insert into lunch_events(title, price)
select 'Divendres · Fideus a la cassola', 10
where not exists(select 1 from lunch_events where title='Divendres · Fideus a la cassola');
insert into lunch_events(title, price)
select 'Dissabte · Paella', 10
where not exists(select 1 from lunch_events where title='Dissabte · Paella');
