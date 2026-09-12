-- MVP 2026: candidates come from the official tournament pairs and members vote by name.
update public.players p
set gender = case
  when p.full_name = any (array[
    'Alexandra Biosca', 'Blanca Josep', 'Carlota Domínguez', 'Claudia Balcells',
    'Claudia Mitjavila', 'Elena Altes', 'Fiona Garriga Torné', 'Jemi Recasens',
    'Julia Serrano', 'Laia Casafont Corominas', 'Laura Soler Pericas',
    'María Salaverría', 'Paula Quilez', 'Sara Vidal'
  ]) then 'female'
  else 'male'
end
where exists (
  select 1 from public.pairs pair_row
  where pair_row.tournament_id = '2026'
    and (pair_row.player1_id = p.id or pair_row.player2_id = p.id)
);

create or replace function public.submit_mvp_vote_by_name(
  p_member_name text,
  p_male uuid,
  p_female uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  v_member_number integer;
  v_member_name text;
  v_member_count integer;
  v_male_name text;
  v_female_name text;
  v_normalized_name text;
begin
  if not coalesce((select mvp_open from public.tournament_config where id = '2026'), false) then
    raise exception 'La votació MVP encara no està oberta';
  end if;

  v_normalized_name := regexp_replace(
    translate(lower(btrim(coalesce(p_member_name, ''))), 'áàäâéèëêíìïîóòöôúùüûçñ', 'aaaaeeeeiiiioooouuuucn'),
    '\s+', ' ', 'g'
  );

  select count(*), min(member_number), min(full_name)
    into v_member_count, v_member_number, v_member_name
  from public.members_registry
  where active_2026 is true
    and regexp_replace(
      translate(lower(btrim(full_name)), 'áàäâéèëêíìïîóòöôúùüûçñ', 'aaaaeeeeiiiioooouuuucn'),
      '\s+', ' ', 'g'
    ) = v_normalized_name;

  if v_member_count = 0 then
    raise exception 'No hem trobat aquest nom entre els socis actius del 2026';
  end if;
  if v_member_count > 1 then
    raise exception 'Hi ha més d’un soci amb aquest nom. Contacta amb l’organització';
  end if;

  select p.full_name into v_male_name
  from public.players p
  where p.id = p_male and p.gender = 'male'
    and exists (
      select 1 from public.pairs pair_row
      where pair_row.tournament_id = '2026'
        and (pair_row.player1_id = p.id or pair_row.player2_id = p.id)
    );
  if v_male_name is null then
    raise exception 'El jugador masculí seleccionat no és un candidat vàlid';
  end if;

  select p.full_name into v_female_name
  from public.players p
  where p.id = p_female and p.gender = 'female'
    and exists (
      select 1 from public.pairs pair_row
      where pair_row.tournament_id = '2026'
        and (pair_row.player1_id = p.id or pair_row.player2_id = p.id)
    );
  if v_female_name is null then
    raise exception 'La jugadora seleccionada no és una candidata vàlida';
  end if;

  begin
    insert into public.mvp_votes_secure(
      tournament_year, member_number, member_name, male_vote, female_vote
    ) values (2026, v_member_number, v_member_name, v_male_name, v_female_name);
  exception when unique_violation then
    raise exception 'Aquest soci ja ha votat';
  end;

  return jsonb_build_object('ok', true, 'member', v_member_name);
end;
$function$;

revoke all on function public.submit_mvp_vote_by_name(text, uuid, uuid) from public;
grant execute on function public.submit_mvp_vote_by_name(text, uuid, uuid) to anon, authenticated;
