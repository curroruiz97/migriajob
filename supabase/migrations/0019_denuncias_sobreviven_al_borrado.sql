-- Las denuncias no se borran cuando quien denuncia se da de baja.
--
-- QUE PASABA. `content_reports.reporter_id` apuntaba a `profiles` con
-- ON DELETE CASCADE. Al eliminar la cuenta (RGPD art. 17, /api/me/delete ->
-- Auth Admin API -> cascada auth.users -> profiles), desaparecian tambien
-- todas las denuncias que esa persona hubiera puesto.
--
-- POR QUE IMPORTA. Es justo el caso que la directriz 1.2 de Apple quiere
-- cubrir: alguien sufre acoso, denuncia y se marcha de la aplicacion. Con la
-- cascada, su marcha borraba la unica prueba de lo ocurrido y el perfil
-- denunciado se quedaba sin revisar. La bandeja de moderacion perdia filas
-- sin que nadie se enterara.
--
-- Lo vimos al grabar el video de revision: la denuncia de una oferta hecha
-- desde una cuenta de prueba se evaporo al borrar esa cuenta al final.
--
-- QUE HACE ESTO. `reporter_id` pasa a poder ser nulo y la clave ajena a
-- ON DELETE SET NULL: la denuncia se queda, anonima. Es ademas lo correcto
-- en proteccion de datos —se elimina el dato personal, no el hecho—, y es lo
-- mismo que ya se hacia con `reviewed_by`.
--
-- La politica de insercion sigue exigiendo `reporter_id = auth.uid()`, asi
-- que no se pueden crear denuncias anonimas: solo quedan anonimas despues.

alter table public.content_reports
  alter column reporter_id drop not null;

alter table public.content_reports
  drop constraint content_reports_reporter_id_fkey;

alter table public.content_reports
  add constraint content_reports_reporter_id_fkey
  foreign key (reporter_id) references public.profiles (id)
  on delete set null;
