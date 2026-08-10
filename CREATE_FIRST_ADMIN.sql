-- TORNEIG FRONTÓ GELIDA 2026 · DONAR ROL D'ADMIN AL PRIMER USUARI
-- 1. Primer crea l'usuari a Supabase: Authentication > Users > Add user.
-- 2. Substitueix el correu de sota pel mateix correu de l'usuari.
-- 3. Executa aquest SQL.

insert into public.profiles(id,full_name,role,is_member)
select id, coalesce(raw_user_meta_data->>'full_name', email), 'admin', true
from auth.users
where lower(email)=lower('POSA_AQUI_EL_TEU_EMAIL')
on conflict(id) do update set
  role='admin',
  is_member=true,
  full_name=excluded.full_name;

-- Comprovació: ha de retornar l'usuari amb role = admin
select p.id,p.full_name,p.role,p.is_member,u.email
from public.profiles p
join auth.users u on u.id=p.id
where p.role='admin';
