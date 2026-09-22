-- ============================================================
-- Migración 0021: las consultas del formulario de contacto se guardan
-- ============================================================
-- QUÉ PASABA
-- El formulario de /contacto era `action="mailto:hola@migriajob.com"` con
-- `method="post"`. Eso no envía nada a ningún servidor: le pide al navegador
-- que abra el cliente de correo del visitante con el contenido pegado dentro.
--
-- En la práctica:
--   · Chrome avisa de que "el formulario no es seguro" antes de enviarlo,
--     porque mailto: no es https. Nadie rellena un formulario que avisa de eso.
--   · En un móvil sin cuenta de correo configurada, y dentro de la app, no
--     ocurre nada en absoluto.
--   · Aunque funcione, el mensaje sale del correo personal del visitante, con
--     el formato que decida su cliente, y no queda registro de nada.
--
-- POR QUÉ IMPORTA MÁS DE LO QUE PARECE
-- Migria no es un portal de autoservicio: la empresa no se sirve sola del
-- catálogo, escribe y el equipo lleva el proceso. Este formulario es la puerta
-- de entrada de la demanda, y la demanda es justo lo que falta —1.267 perfiles
-- frente a 6 ofertas reales—. Cada consulta que se pierde aquí es un cliente.

create table if not exists contact_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  -- 'company' | 'candidate' | 'partner' | 'other', tal como los ofrece el
  -- formulario. Sin enum a propósito: el desplegable de una página de
  -- marketing cambia más a menudo que un tipo de Postgres.
  role text not null,
  company text,
  sector text,
  message text not null,
  -- Para saber de dónde entró el lead sin depender de analítica externa.
  source_path text,
  handled boolean not null default false,
  handled_by uuid references profiles(id) on delete set null,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contact_requests_created_idx
  on contact_requests(created_at desc);
create index if not exists contact_requests_pendientes_idx
  on contact_requests(handled, created_at desc);

alter table contact_requests enable row level security;

-- Nadie escribe aquí desde la clave pública: la inserción la hace el servidor
-- con la clave de servicio, después de validar. Si se dejara abierto a `anon`,
-- cualquiera podría llenar la tabla con una llamada a la API, sin pasar por el
-- formulario ni por su validación.
--
-- Y solo el equipo de Migria lee: son datos de contacto de terceros.
drop policy if exists "Admin lee consultas" on contact_requests;
create policy "Admin lee consultas" on contact_requests
  for select using (auth_role() = 'admin');

drop policy if exists "Admin gestiona consultas" on contact_requests;
create policy "Admin gestiona consultas" on contact_requests
  for update using (auth_role() = 'admin') with check (auth_role() = 'admin');
