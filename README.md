# Torneig Frontó Gelida 2026

Portal web del campionat, amb una zona pública i una zona d'organització.

## Web pública
- `/` Inici
- `/resultats` Horaris i resultats
- `/quadre` Quadre complet
- `/quan-jugo` Buscador de jugadors
- `/dinars` Reserves de dinar
- `/inscripcio` Inscripció al torneig
- `/merchandising` Comandes de merchandising
- `/mvp` Votació MVP
- `/avisos` Avisos oficials
- `/fotos` Dropbox
- `/patrocinadors` Patrocinadors

## Organització
- `/admin` Dashboard
- `/admin/marcador` Marcador / arbitratge
- `/admin/horaris` Horaris i pistes
- `/admin/pagaments` Bizums
- `/admin/dinars` Dinars
- `/admin/parelles` Parelles i inscripcions
- `/admin/avisos` Comunicació
- `/admin/configuracio` Configuració

## Arquitectura
- Hosting: Vercel
- Codi: GitHub
- Backend previst: Supabase
- Pagaments: Bizum manual amb verificació de l'organització
- Fotos: Dropbox

## Estat actual
El frontend és usable, responsive i sincronitzat amb Supabase. El format 2026 té 8 grups de primera fase (A–H), 8 grups de segona fase (I–P) i eliminatòries des de quarts; en total, 56 partits.

Els caps de sèrie 1–8 no juguen la primera fase. Les parelles 9–16 encapçalen els grups A–H amb dues parelles més; passen les dues primeres. A la segona fase passa només el líder de cada grup. Els quarts són I–M, J–N, K–O i L–P, i les semifinals minimitzen la repetició de rivals.

Veure `CHECKLIST_CAMPIONAT.md` per a la llista exacta de tasques de producció.
