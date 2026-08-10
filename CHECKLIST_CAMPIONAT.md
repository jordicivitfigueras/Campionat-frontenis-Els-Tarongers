# Checklist per deixar el Torneig Frontó Gelida 2026 llest per al campionat

## Fet en aquesta versió
- Portal públic responsive amb navegació lateral professional i versió mòbil.
- Pàgina d'informació general del torneig.
- Inici amb accessos ràpids i patrocinadors.
- Horaris i resultats.
- Quadre complet amb totes les fases.
- Buscador “Quan jugo?”.
- Pantalla pública “En directe”.
- Dinars amb diversos assistents, llista pública, cercador i estat Bizum.
- Inscripció normal 22 € / inscripció + soci 35 € per jugador.
- Merchandising amb talla, quantitat i Bizum.
- MVP masculí i femení amb obertura/tancament des d'administració.
- Gestió del recompte MVP.
- Avisos públics.
- Fotos via Dropbox.
- Pàgina pròpia de patrocinadors.
- Portal d’organització separat per rutes.
- Marcador d’arbitratge amb proteccions bàsiques abans de finalitzar un partit.
- Gestió d’horaris i pistes amb publicació d'avisos.
- Control de pagaments Bizum i verificació.
- Gestió de dinars.
- Llistat de parelles i inscripcions web.
- Publicació i eliminació d’avisos.
- Configuració general: preus, Dropbox, Bizum i obertura/tancament de formularis.
- Exportació CSV de partits, inscripcions, dinars, Bizums i merchandising.
- Backup local complet en JSON.
- URLs netes de Vercel.
- PWA instal·lable / “Afegir a la pantalla d'inici”.
- Service worker amb cache de contingut bàsic.
- Pàgina 404 personalitzada.
- Esquema Supabase de producció amb RLS i Realtime preparat a `schema.sql`.

## Imprescindible abans d’utilitzar-la amb gent real
1. **Connectar Supabase.** Ara les dades són `localStorage`; cada navegador té dades diferents. Cal crear el projecte, executar `schema.sql` i connectar frontend + Realtime.
2. **Autenticació real de l’organització.** `/admin` necessita Supabase Auth i rols Administrador / Àrbitre abans de posar-hi dades reals.
3. **Validació real de socis per a l’MVP.** Cal carregar el cens definitiu de socis i vincular el vot a un usuari autenticat.
4. **Revisar candidats MVP.** Confirmar la classificació masculina/femenina definitiva abans d’obrir la votació.
5. **Logo oficial.** Substituir `logo.svg` pel fitxer oficial definitiu si l’actual no és exacte.
6. **Bizum.** Afegir número/instruccions definitives i decidir el text que ha de posar la gent al concepte.
7. **Preus merchandising.** Confirmar els preus finals i productes/talles disponibles.
8. **Dropbox.** Afegir l’enllaç compartit definitiu.
9. **Horaris i pistes.** Revisar la planificació final abans de publicar-la.
10. **Parelles definitives.** Carregar les 32 parelles finals i eliminar places lliures.
11. **Prova completa de competició.** Simular un torneig sencer per comprovar propagació de guanyadors/perdedors fins a la final.
12. **Prova amb 2–3 mòbils.** Després de Supabase, provar arbitratge, canvi d’horari, resultat, dinar, Bizum i avisos simultàniament.

## Recomanat abans del campionat
- Edició/cancel·lació de reserva per part de l'usuari amb un enllaç o codi segur.
- Historial/auditoria de qui modifica horaris i resultats.
- Còpia de seguretat de Supabase abans de cada jornada.
- QR gran del portal públic per penjar al frontó.
- Política de privacitat / informació bàsica de dades personals si es recullen telèfons o emails.
- Revisió final amb iPhone + Android + ordinador/TV.

## Arquitectura final
- Frontend: Vercel.
- Base de dades + Realtime + Auth: Supabase.
- Pagaments: Bizum manual verificat per l’organització.
- Fotos: Dropbox.
- Codi i versions: GitHub.
