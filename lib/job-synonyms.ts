/**
 * Diccionario de sinónimos de puestos de trabajo del sector servicios
 * (hostelería, restauración, hotelería) con foco en variantes españolas
 * y latinoamericanas — el mismo puesto se llama distinto en cada país.
 *
 * Cada SUBARRAY es un "grupo de equivalencia": cuando el buscador detecta
 * cualquiera de sus términos en la consulta del usuario, expande la búsqueda
 * a TODOS los demás términos del grupo. Así "chef" encuentra "cocinero",
 * "mesero" encuentra "camarero" y "lavalozas" (CL/PE) encuentra "fregaplatos"
 * (ES) o "lavavajillas".
 *
 * Convención: usa la forma masculina/singular como término principal. El
 * stemmer aplicado luego se encarga del género y el plural (cocinero ↔
 * cocinera ↔ cocineros ↔ cocineras).
 */
export const JOB_SYNONYM_GROUPS: string[][] = [
  // Cocina
  ['cocinero', 'chef', 'cheff', 'cuoco', 'jefe de partida'],
  ['ayudante de cocina', 'auxiliar de cocina', 'pinche', 'pinche de cocina', 'segundo de cocina'],
  ['jefe de cocina', 'chef ejecutivo', 'chef de cocina', 'head chef'],
  ['parrillero', 'asador', 'grillman', 'cocinero de parrilla'],
  ['repostero', 'pastelero', 'reposteria', 'pasteleria', 'patissier'],
  ['panadero', 'panaderia', 'horneador'],
  ['fregaplatos', 'lavaplatos', 'lavalozas', 'lavavajillas', 'lavacopas', 'steward', 'lavaloza'],

  // Sala / atención al cliente
  ['camarero', 'mesero', 'mozo', 'moza de sala', 'waiter', 'salonero', 'mesonero'],
  ['ayudante de camarero', 'runner', 'corredor de comida', 'food runner', 'corre platos'],
  ['barman', 'bartender', 'cantinero', 'tragos'],
  ['barista', 'cafetero', 'cafetera', 'maestro cafetero', 'preparador de cafe'],
  ['sumiller', 'sommelier', 'enologo', 'cata de vinos'],
  ['jefe de sala', 'encargado de sala', 'maitre', 'gerente de sala', 'capitan de meseros'],
  ['host', 'hostess', 'anfitrion', 'recibidor'],

  // Hotel / recepción / pisos
  ['recepcionista', 'recepcion', 'front desk', 'recepcion hotel'],
  ['camarera de pisos', 'mucama', 'azafata de pisos', 'housekeeping', 'limpieza de habitaciones', 'recamarera'],
  ['conserje', 'consierge', 'porteria', 'portero de hotel'],
  ['gobernanta', 'gobernante', 'jefa de pisos', 'jefe de pisos', 'supervisora de pisos'],
  ['botones', 'bellboy', 'bellman', 'maletero', 'mozo de equipaje'],

  // Limpieza y servicios auxiliares
  ['personal de limpieza', 'limpiador', 'limpiadora', 'aseador', 'aseadora', 'oficial de limpieza'],

  // Mandos / gestión
  ['encargado', 'supervisor', 'manager', 'gerente', 'responsable', 'jefe de turno', 'lider de turno'],
  ['director', 'directora', 'gerente general', 'director general', 'manager general'],
  ['cajero', 'cashier', 'cajero de restaurante'],

  // Operaciones / preparación
  ['preparador', 'preparadora', 'auxiliar de produccion', 'operario de produccion'],
  ['delivery', 'repartidor', 'cadete', 'motorizado', 'delivery boy', 'mensajero'],
];

/**
 * Devuelve los grupos de sinónimos que coinciden con el término dado.
 * Comparación sin acentos y case-insensitive; cualquier término del grupo
 * que aparezca COMO SUSBSTRING del input (o viceversa) activa el match.
 *
 * Si no encuentra coincidencias, devuelve []. El caller debe entonces usar
 * solo la consulta original (sin expansión).
 */
export function findSynonymGroups(input: string): string[][] {
  const needle = normalize(input);
  if (!needle) return [];
  const out: string[][] = [];
  for (const group of JOB_SYNONYM_GROUPS) {
    const hit = group.some((term) => {
      const n = normalize(term);
      return needle.includes(n) || n.includes(needle);
    });
    if (hit) out.push(group);
  }
  return out;
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
