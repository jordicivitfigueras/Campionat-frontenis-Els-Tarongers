-- Esquema orientatiu per a una futura connexió Supabase.
create table if not exists tournament_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);
