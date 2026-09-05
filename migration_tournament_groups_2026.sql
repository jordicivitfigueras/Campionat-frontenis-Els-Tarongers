-- Format 2026: 8 grups de primera fase, 8 grups de segona fase i eliminatòries.
alter table public.matches add column if not exists phase_number integer;
alter table public.matches add column if not exists group_code text;
alter table public.matches add column if not exists match_number integer;

insert into public.players(full_name)
select 'Ramon Maria Nadal'
where not exists (select 1 from public.players where lower(full_name)=lower('Ramon Maria Nadal'));

-- Completa les dues inscripcions acceptades que encara no estaven ben traslladades a pairs.
update public.pairs
set player1_id=(select id from public.players where lower(full_name)=lower('Paula Quilez') limit 1),
    player2_id=(select id from public.players where lower(full_name)=lower('Marc Cid') limit 1),
    status='confirmed'
where tournament_id='2026' and seed=21 and player1_id is null and player2_id is null;

update public.pairs
set player2_id=(select id from public.players where lower(full_name)=lower('Ramon Maria Nadal') limit 1),
    status='confirmed'
where tournament_id='2026' and seed=23
  and player1_id=(select id from public.players where lower(full_name)=lower('Albert Civit') limit 1);

update public.pairs set seed=seed+100 where tournament_id='2026';

with desired(rank,n1,n2) as (values
  (1,'Adri Salaverría','María Salaverría'),(2,'Albert Cabezas','Ramon Romero'),(3,'Mauro Lenhardi','Roger Juanola'),(4,'Julia Serrano','Juan Sobreroca'),
  (5,'Alvaro Palou','Pepe Palou'),(6,'Lluís Aymami','Diego Salvo'),(7,'Marc Muntané','Alex Sanchez'),(8,'Arnau Costa','Otger Costa'),
  (9,'Maurici Monguet','Marius Alcala'),(10,'Marc Balcells','Manel Villegas'),(11,'Lluís Cabezas','Xavi Palou Pare'),(12,'Sergi Ripollés','Ferran Cabezas'),
  (13,'Edu Llop','David Llop'),(14,'Jordi Civit','Laura Soler Pericas'),(15,'Toni Civit','Jordi Balcells Senior'),(16,'Pol Gaynes','Gerard Civit'),
  (17,'Claudia Balcells','Jemi Recasens'),(18,'Sara Vidal','Blanca Josep'),(19,'Ian Dameson','Eloi de la Torre'),(20,'Paula Quilez','Marc Cid'),
  (21,'Carlota Domínguez','Joel Socias'),(22,'Pau Tetas','Ángel Sáenz'),(23,'Guillem Tost','Joan Valette'),(24,'Albert Civit','Ramon Maria Nadal'),
  (25,'Pol Mitjavila','Martí Coma'),(26,'Claudia Mitjavila','Guille Soler'),(27,'Luis Lanuza','Edu Soler'),(28,'Laia Casafont Corominas','Fiona Garriga Torné'),
  (29,'Alexandra Biosca','Elena Altes'),(31,'Nacho Palou','Jorge Palou'),(32,'Alex Herrera','Daniel Capdevila')
)
update public.pairs p set seed=d.rank,status='confirmed'
from desired d,public.players p1,public.players p2
where p.tournament_id='2026' and p.player1_id=p1.id and p.player2_id=p2.id
and ((lower(p1.full_name)=lower(d.n1) and lower(p2.full_name)=lower(d.n2))
  or (lower(p1.full_name)=lower(d.n2) and lower(p2.full_name)=lower(d.n1)));

update public.pairs set seed=30,status='pending'
where tournament_id='2026' and player1_id is null and player2_id is null;

delete from public.match_score_history where tournament_id='2026';
delete from public.matches where tournament_id='2026';

with first_groups(g,s1,s2,s3) as (values
  ('A',9,17,18),('B',10,19,20),('C',11,21,22),('D',12,23,24),
  ('E',13,25,26),('F',14,27,28),('G',15,29,30),('H',16,31,32)
), first_games as (
  select g,n,a,b,g||n::text as id from first_groups
  cross join lateral (values (1,s1,s2),(2,s2,s3),(3,s1,s3)) v(n,a,b)
), times(id,at) as (values
  ('B1','Dijous 10 · 17:00'),('C1','Dijous 10 · 17:20'),('D1','Dijous 10 · 17:40'),('E1','Dijous 10 · 18:00'),('H1','Dijous 10 · 18:20'),('G1','Dijous 10 · 18:40'),
  ('B2','Dijous 10 · 19:00'),('C2','Dijous 10 · 19:20'),('D2','Dijous 10 · 19:40'),('E2','Dijous 10 · 20:00'),('H2','Dijous 10 · 20:20'),('B3','Dijous 10 · 20:40'),('G3','Dijous 10 · 21:00'),
  ('C3','Divendres 11 · 09:40'),('D3','Divendres 11 · 10:00'),('E3','Divendres 11 · 10:20'),('H3','Divendres 11 · 10:40'),('G2','Divendres 11 · 11:00'),('F1','Divendres 11 · 11:20'),
  ('A1','Divendres 11 · 11:40'),('F2','Divendres 11 · 12:00'),('A2','Divendres 11 · 12:20'),('F3','Divendres 11 · 12:40'),('A3','Divendres 11 · 13:00')
)
insert into public.matches(id,tournament_id,stage,phase_number,group_code,match_number,team1_id,team2_id,team1_source,team2_source,scheduled_at,court,status)
select f.id,'2026','1a fase · Grup '||f.g,1,f.g,f.n,p1.id,p2.id,'S'||f.a,'S'||f.b,t.at,'Pista 1','pending'
from first_games f join times t using(id)
join public.pairs p1 on p1.tournament_id='2026' and p1.seed=f.a
join public.pairs p2 on p2.tournament_id='2026' and p2.seed=f.b;

with second_groups(g,a,b,c) as (values
  ('I','S1','1A','2B'),('J','S2','1B','2C'),('K','S3','1C','2D'),('L','S4','1D','2E'),
  ('M','S5','1E','2F'),('N','S6','1F','2G'),('O','S7','1G','2H'),('P','S8','1H','2A')
), second_games as (
  select g,n,x,y,g||n::text as id from second_groups
  cross join lateral (values (1,a,b),(2,b,c),(3,a,c)) v(n,x,y)
), times(id,at) as (values
  ('I1','Divendres 11 · 13:40'),('J1','Divendres 11 · 14:00'),('K1','Divendres 11 · 17:00'),('L1','Divendres 11 · 17:20'),('M1','Divendres 11 · 17:40'),('N1','Divendres 11 · 18:00'),('O1','Divendres 11 · 18:20'),('P1','Divendres 11 · 18:40'),
  ('I2','Divendres 11 · 19:00'),('J2','Divendres 11 · 19:20'),('K2','Divendres 11 · 19:40'),('L2','Divendres 11 · 20:00'),('M2','Divendres 11 · 20:20'),('N2','Divendres 11 · 20:40'),('O2','Divendres 11 · 21:00'),('P2','Divendres 11 · 21:20'),
  ('I3','Dissabte 12 · 09:30'),('J3','Dissabte 12 · 09:50'),('K3','Dissabte 12 · 10:10'),('L3','Dissabte 12 · 10:30'),('M3','Dissabte 12 · 10:50'),('N3','Dissabte 12 · 11:10'),('O3','Dissabte 12 · 11:30'),('P3','Dissabte 12 · 11:50')
)
insert into public.matches(id,tournament_id,stage,phase_number,group_code,match_number,team1_source,team2_source,scheduled_at,court,status)
select s.id,'2026','2a fase · Grup '||s.g,2,s.g,s.n,s.x,s.y,t.at,'Pista 1','pending'
from second_games s join times t using(id);

insert into public.matches(id,tournament_id,stage,phase_number,team1_source,team2_source,scheduled_at,court,status) values
  ('Q1','2026','1/4',3,'1I','1M','Dissabte 12 · 16:30','Pista 1','pending'),
  ('Q2','2026','1/4',3,'1J','1N','Dissabte 12 · 17:00','Pista 1','pending'),
  ('Q3','2026','1/4',3,'1K','1O','Dissabte 12 · 17:30','Pista 1','pending'),
  ('Q4','2026','1/4',3,'1L','1P','Dissabte 12 · 18:00','Pista 1','pending'),
  ('S1','2026','1/2',4,'Guanyadors Q · anti-repetició','Guanyadors Q · anti-repetició','Dissabte 12 · 19:00','Pista 1','pending'),
  ('S2','2026','1/2',4,'Guanyadors Q · anti-repetició','Guanyadors Q · anti-repetició','Dissabte 12 · 19:30','Pista 1','pending'),
  ('3/4','2026','3r i 4t',5,'Perdedor S1','Perdedor S2','Dissabte 12 · 20:30','Pista 1','pending'),
  ('FINAL','2026','Final',5,'Guanyador S1','Guanyador S2','Dissabte 12 · 21:00','Pista 1','pending');

do $$ begin
  if (select count(*) from public.pairs where tournament_id='2026') <> 32
     or (select count(distinct seed) from public.pairs where tournament_id='2026') <> 32 then
    raise exception 'La reordenació no ha produït 32 llavors úniques';
  end if;
  if (select count(*) from public.matches where tournament_id='2026') <> 56 then
    raise exception 'El nou format no ha produït 56 partits';
  end if;
end $$;
