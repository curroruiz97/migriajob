-- ============================================================
-- Migración 0016: Moderación — denuncias y bloqueo de usuarios
-- ============================================================
-- POR QUÉ EXISTE ESTO
-- MigriaJob tiene contenido que escriben los propios usuarios: perfiles
-- públicos e indexados, ofertas que se publican al instante y mensajería de
-- texto libre entre empresa y candidato. La directriz 1.2 de Apple exige, para
-- ese caso, que cualquiera pueda denunciar contenido y bloquear a quien le
-- moleste, y que alguien atienda esas denuncias. Sin esto la app se rechaza, y
-- —más importante— un candidato acosado por un empleador no tenía ninguna
-- salida dentro del producto.

-- ============ DENUNCIAS ============

create type report_target as enum (
  'candidate_profile',  -- ficha pública de un candidato
  'job',                -- oferta de empleo
  'company',            -- perfil de empresa
  'message',            -- un mensaje concreto
  'conversation'        -- una conversación entera
);

create type report_reason as enum (
  'spam',
  'fraude',              -- oferta falsa, petición de dinero, estafa
  'contenido_ofensivo',
  'acoso',
  'datos_falsos',
  'suplantacion',
  'otro'
);

create type report_status as enum ('abierta', 'en_revision', 'resuelta', 'descartada');

create table if not exists content_reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  target_type report_target not null,
  -- Sin clave foránea a propósito: el objetivo vive en tablas distintas según
  -- target_type, y la denuncia debe sobrevivir al borrado del contenido (si no,
  -- bastaría con borrar la oferta para hacer desaparecer la denuncia).
  target_id uuid not null,
  reason report_reason not null,
  details text,
  status report_status not null default 'abierta',
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now()
);

create index if not exists content_reports_status_idx
  on content_reports(status, created_at desc);
create index if not exists content_reports_target_idx
  on content_reports(target_type, target_id);

alter table content_reports enable row level security;

create policy "Reporter creates own report" on content_reports for insert
  with check (reporter_id = auth.uid());
create policy "Reporter reads own reports" on content_reports for select
  using (reporter_id = auth.uid() or auth_role() = 'admin');
create policy "Admin resolves reports" on content_reports for update
  using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ============ BLOQUEOS ============

create table if not exists blocked_users (
  id uuid primary key default uuid_generate_v4(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique(blocker_id, blocked_id),
  constraint blocked_users_no_self check (blocker_id <> blocked_id)
);

create index if not exists blocked_users_blocked_idx on blocked_users(blocked_id);

alter table blocked_users enable row level security;

-- Cada uno gestiona su propia lista y solo ve la suya: quién te ha bloqueado no
-- es asunto tuyo, y saberlo facilitaría buscarle las vueltas.
create policy "Owner manages own blocks" on blocked_users for all
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());

-- El bloqueo tiene que valer en las dos direcciones, pero bajo RLS un usuario no
-- puede leer las filas del otro. De ahí security definer: la función responde
-- sí/no sin filtrar quién bloqueó a quién.
create or replace function is_blocked_between(a uuid, b uuid) returns boolean as $$
  select exists (
    select 1 from blocked_users
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$ language sql stable security definer set search_path = public;

revoke all on function is_blocked_between(uuid, uuid) from public;
grant execute on function is_blocked_between(uuid, uuid) to authenticated;

-- ============ El bloqueo se aplica en la base de datos, no en la interfaz ============
-- Esconder el botón no basta: las acciones de servidor escriben con la sesión
-- del usuario, así que la regla vive donde no se puede rodear.

drop policy if exists "Members create own conversations" on conversations;
create policy "Members create own conversations" on conversations for insert
  with check (
    (employer_id = auth.uid() or candidate_id = auth.uid())
    and not is_blocked_between(employer_id, candidate_id)
  );

drop policy if exists "Members write messages" on messages;
create policy "Members write messages" on messages for insert with check (
  sender_id = auth.uid() and exists (
    select 1 from conversations c
    where c.id = messages.conversation_id
      and (c.employer_id = auth.uid() or c.candidate_id = auth.uid())
      and not is_blocked_between(c.employer_id, c.candidate_id)
  )
);
