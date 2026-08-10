# Checklist per deixar el Torneig Frontó Gelida 2026 llest per al campionat

## Fet en aquesta versió
- Portal públic responsive i navegació professional.
- Inici amb accessos ràpids i patrocinadors.
- Horaris i resultats.
- Quadre complet amb totes les fases.
- Buscador “Quan jugo?”.
- Dinars amb diversos assistents, llista pública i estat Bizum.
- Inscripció normal 22 € / inscripció + soci 35 € per jugador.
- Merchandising amb talla, quantitat i Bizum.
- MVP masculí i femení.
- Avisos públics.
- Fotos via Dropbox.
- Portal d’organització separat per rutes.
- Marcador d’arbitratge.
- Gestió d’horaris i pistes.
- Control de pagaments Bizum.
- Gestió de dinars.
- Llistat de parelles i inscripcions web.
- Publicació d’avisos.
- Configuració general.
- URLs netes de Vercel.

## Imprescindible abans d’utilitzar-la amb gent real
1. **Connectar Supabase.** Ara les dades són `localStorage`; cada navegador té dades diferents. Cal centralitzar partits, resultats, reserves, Bizums, avisos, votacions i configuració.
2. **Autenticació de l’organització.** `/admin` encara necessita un login real i rols (Administrador / Àrbitre).
3. **Validació de socis per a l’MVP.** Cal carregar el cens definitiu de socis i impedir de forma segura més d’un vot per soci.
4. **Revisar candidats MVP.** Confirmar classificació masculina/femenina dels noms abans d’obrir la votació.
5. **Logo oficial.** Substituir `logo.svg` pel fitxer oficial definitiu si l’actual no és exacte.
6. **Bizum.** Afegir número/instruccions definitives i decidir el text que ha de posar la gent al concepte.
7. **Preus merchandising.** Confirmar preus finals i productes/talles disponibles.
8. **Dropbox.** Afegir l’enllaç compartit definitiu.
9. **Horaris i pistes.** Revisar la planificació final abans de publicar-la.
10. **Parelles definitives.** Carregar les 32 parelles finals i eliminar places lliures.
11. **Prova completa de competició.** Simular un torneig sencer per comprovar propagació de guanyadors/perdedors fins a la final.
12. **Prova amb 2–3 mòbils.** Després de Supabase, provar arbitratge, canvi d’horari, resultat, dinar, Bizum i avisos simultàniament.

## Recomanat abans del campionat
- Confirmació/edició/cancel·lació de reserva de dinar per l’usuari.
- Exportació CSV de dinars, Bizums, inscripcions i merchandising.
- Historial/auditoria de canvis d’horari i resultats.
- Còpia de seguretat de la base de dades abans de cada jornada.
- QR gran del portal públic per penjar al frontó.
- PWA / “Afegir a la pantalla d’inici”.
- Pàgina 404 personalitzada.
- Política de privacitat / informació bàsica de dades personals si es recullen telèfons o emails.
- Tancament automàtic/manual de formularis (inscripció, dinars, MVP, merchandising).
- Pantalla pública de partit en joc per a TV/monitor, si es vol utilitzar.

## Arquitectura final recomanada
- Frontend: Vercel.
- Base de dades + Realtime + Auth: Supabase.
- Pagaments: Bizum manual verificat per l’organització.
- Fotos: Dropbox.
- Codi i versions: GitHub.
