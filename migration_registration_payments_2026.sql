-- Torneig Frontó Gelida 2026 · pagaments d'inscripció previs a Supabase
-- Executar UNA VEGADA al SQL Editor després de schema.sql.
-- És idempotent: es pot tornar a executar sense duplicar dades.

create table if not exists registration_payments (
  full_name text primary key,
  amount numeric(10,2) not null check (amount in (22,35)),
  registration_type text not null check (registration_type in ('normal','member')),
  payment_date date,
  payment_status text not null default 'verified' check (payment_status in ('pending','verified')),
  source text not null default 'historic_2026',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table registration_payments enable row level security;
drop policy if exists "staff read registration payments" on registration_payments;
drop policy if exists "admin manage registration payments" on registration_payments;
create policy "staff read registration payments" on registration_payments for select using (is_staff());
create policy "admin manage registration payments" on registration_payments for all using (is_admin()) with check (is_admin());

insert into registration_payments(full_name,amount,registration_type,payment_date,payment_status)
values
('Adri Salaverría',35,'member','2026-08-07','verified'),
('Alvaro Palou',35,'member','2026-08-06','verified'),
('Arnau Costa',35,'member','2026-08-07','verified'),
('Carlota Domínguez',35,'member','2026-06-21','verified'),
('Claudia Mitjavila',35,'member','2026-07-24','verified'),
('Dardo Soler',35,'member','2026-06-21','verified'),
('Edu Soler',35,'member','2026-06-21','verified'),
('Ferran Cabezas',35,'member','2026-06-19','verified'),
('Guille Soler',22,'normal','2026-07-24','verified'),
('Joel Socias',35,'member','2026-06-21','verified'),
('Laia Casafont',35,'member','2026-06-23','verified'),
('Lluís Cabezas',35,'member','2026-06-22','verified'),
('Marc Muntané',35,'member','2026-06-21','verified'),
('María Salaverría',35,'member','2026-08-07','verified'),
('Marius Alcala',35,'member','2026-06-21','verified'),
('Mauro Lenhardi',35,'member','2026-06-08','verified'),
('Nacho Palou',35,'member','2026-06-08','verified'),
('Otger Costa',35,'member','2026-08-07','verified'),
('Pol Mitjavila',35,'member','2026-06-30','verified'),
('Roger Casafont',35,'member',null,'verified'),
('Roger Juanola',35,'member','2026-06-08','verified'),
('Sergi Ripollés',35,'member','2026-06-19','verified'),
('Xavi Palou fill',35,'member','2026-06-21','verified'),
('Xavi Palou Pare',35,'member','2026-06-22','verified')
on conflict (full_name) do update set
  amount=excluded.amount,
  registration_type=excluded.registration_type,
  payment_date=excluded.payment_date,
  payment_status=excluded.payment_status,
  updated_at=now();

-- Si els jugadors ja existeixen, marca com a socis els que han pagat 35 €.
update players p
set is_member = true
from registration_payments rp
where lower(p.full_name)=lower(rp.full_name)
  and rp.registration_type='member';

-- Control de total esperat: ha de retornar 722.00
select sum(amount) as total_pagaments_confirmats from registration_payments where payment_status='verified';
