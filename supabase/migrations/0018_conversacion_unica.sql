-- Una sola conversacion por pareja empresa/candidato.
--
-- POR QUE. El boton "Contactar" busca el hilo y, si no existe, lo crea. Entre
-- la consulta y el insert cabe otra pulsacion —dos toques seguidos, o la
-- persona escribiendo desde dos sitios—, y el resultado serian dos hilos con
-- los mismos participantes: los mensajes se repartirian entre ambos y cada
-- parte veria una mitad de la conversacion.
--
-- El indice lo impide en la base de datos, que es el unico sitio donde no hay
-- carrera posible. La accion trata el 23505 releyendo el hilo que ya existe,
-- asi que para el usuario no cambia nada.

create unique index if not exists conversations_pareja_idx
  on public.conversations (employer_id, candidate_id);
