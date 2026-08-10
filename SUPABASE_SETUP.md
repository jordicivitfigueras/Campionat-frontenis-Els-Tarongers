# Activar Supabase per al Torneig Frontó Gelida 2026

Aquesta és la part que converteix el frontend actual en una aplicació multiusuari real.

## 1. Crear projecte
1. Crear un projecte nou a Supabase.
2. Obrir **SQL Editor**.
3. Executar tot el contingut de `schema.sql`.

## 2. Carregar dades inicials
- Configuració del torneig 2026.
- Jugadors i condició de soci.
- Parelles definitives.
- Partits i camins del quadre.
- Productes de merchandising.

## 3. Frontend
A `config.js` posar:

```js
window.SUPABASE_URL = "https://xxxx.supabase.co";
window.SUPABASE_ANON_KEY = "ey...";
```

La clau **anon** de Supabase es pot utilitzar al navegador quan les polítiques RLS estan ben configurades. No posar mai la `service_role` al repositori ni al frontend.

## 4. Organització
Crear usuaris Supabase Auth per a l'organització i crear la seva fila a `profiles`:
- `admin`: accés complet.
- `referee`: resultats, marcador i horaris.

## 5. Socis / MVP
Els socis que hagin de votar necessiten una identitat verificada. Opcions recomanades:
- Magic link per email.
- OTP.
- Codi personal + sistema propi segur.

La base ja limita `mvp_votes` a una fila per soci.

## 6. Realtime
`matches`, `notices` i `lunch_reservations` estan preparades a `schema.sql` per Supabase Realtime.

Quan el marcador finalitza un partit:
1. actualitza `matches`;
2. calcula els següents encreuaments;
3. actualitza les files afectades;
4. Realtime envia els canvis als navegadors oberts.

## 7. Prova obligatòria
Abans del torneig provar simultàniament amb dos mòbils:
- modificar un marcador;
- veure el resultat al segon mòbil;
- canviar un horari;
- comprovar l'avís públic;
- reservar un dinar;
- declarar Bizum;
- verificar Bizum des d'admin;
- obrir/tancar MVP i votar amb un soci.

## Seguretat
- No utilitzar `service_role` al client.
- Mantenir RLS activat.
- L'administració no ha de dependre d'un PIN escrit al JavaScript.
- Verificar que els usuaris `referee` no poden canviar configuració sensible.
