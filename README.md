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
El frontend és usable i responsive. Les dades encara funcionen principalment amb `localStorage`, així que abans d'utilitzar-lo com a sistema multiusuari real cal crear el projecte Supabase, executar `schema.sql` i connectar `config.js`.

Veure `CHECKLIST_CAMPIONAT.md` per a la llista exacta de tasques de producció.
