-- Dispositivos registrados para notificaciones push.
--
-- Un usuario puede tener varios: el iPhone y el iPad, o el mismo telefono tras
-- reinstalar la app. APNs entrega por token, no por usuario, asi que guardamos
-- todos y enviamos a cada uno.
--
-- El token es la clave natural: si el mismo token aparece asociado a otro
-- usuario (movil prestado, cierre de sesion y entrada con otra cuenta), la fila
-- se reasigna en lugar de duplicarse. Si no, el usuario anterior seguiria
-- recibiendo avisos ajenos en ese telefono.

create table if not exists public.device_tokens (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  token       text not null unique,
  platform    text not null check (platform in ('ios', 'android')),
  -- Los tokens de una build instalada desde Xcode solo valen contra el entorno
  -- de pruebas de APNs; los de TestFlight y App Store, contra produccion. No se
  -- puede distinguir mirando el token, asi que el emisor prueba produccion y
  -- reintenta en pruebas si Apple responde BadDeviceToken. Aqui guardamos cual
  -- funciono para no repetir el doble intento en cada envio.
  environment text check (environment in ('production', 'sandbox')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists device_tokens_user_idx on public.device_tokens (user_id);

alter table public.device_tokens enable row level security;

-- El usuario solo ve y gestiona sus propios dispositivos. El envio ocurre en el
-- servidor con la clave de servicio, que no pasa por RLS.
drop policy if exists device_tokens_own_select on public.device_tokens;
create policy device_tokens_own_select on public.device_tokens
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists device_tokens_own_insert on public.device_tokens;
create policy device_tokens_own_insert on public.device_tokens
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists device_tokens_own_update on public.device_tokens;
create policy device_tokens_own_update on public.device_tokens
  for update to authenticated using (user_id = (select auth.uid()));

drop policy if exists device_tokens_own_delete on public.device_tokens;
create policy device_tokens_own_delete on public.device_tokens
  for delete to authenticated using (user_id = (select auth.uid()));
