-- Habilita Supabase Realtime para la tabla `applications`.
--
-- Esto permite que el front (cliente) reciba eventos INSERT/UPDATE/DELETE
-- vía WebSocket. Lo usamos para avisar al empleador en tiempo real cuando
-- un candidato envía una solicitud a alguna de sus ofertas.
--
-- Idempotente: si ya existe, no hace nada.

do $$
begin
  if not exists (
    select 1
      from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'applications'
  ) then
    alter publication supabase_realtime add table public.applications;
  end if;
end$$;

-- Notificación interna (tabla `notifications`) cuando llega una application.
-- Permite además mostrar badges/listados de notificaciones sin necesidad de
-- Realtime, por si la suscripción falla.
create or replace function notify_application_received()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employer uuid;
  v_title text;
begin
  select c.owner_id, j.title
    into v_employer, v_title
    from jobs j
    join companies c on c.id = j.company_id
   where j.id = new.job_id;

  if v_employer is not null then
    insert into notifications (user_id, type, payload)
    values (
      v_employer,
      'application_received',
      jsonb_build_object(
        'application_id', new.id,
        'job_id', new.job_id,
        'candidate_id', new.candidate_id,
        'job_title', coalesce(v_title, '')
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_application_received on public.applications;
create trigger trg_notify_application_received
after insert on public.applications
for each row execute function notify_application_received();
