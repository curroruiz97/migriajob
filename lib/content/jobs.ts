import {
  ChefHat,
  Wrench,
  Users,
  Briefcase,
  Wine,
  Coffee,
  UtensilsCrossed,
  Soup,
  Sandwich,
  BedDouble,
  Hammer,
  Truck,
  Sparkles,
  Wheat,
  Cookie,
  GlassWater,
  Fish,
  Snowflake,
  Warehouse,
  Hotel,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Para recepción/concierge usamos Hotel (presente en lucide v0.542).
const HotelDesk: LucideIcon = Hotel;

export type JobCategory =
  | 'Cocina'
  | 'Sala y servicio'
  | 'Barra y coctelería'
  | 'Café y pastelería'
  | 'Hotelería y alojamiento'
  | 'Hostelería · operaciones'
  | 'Industria alimentaria'
  | 'Pescadería y carnicería'
  | 'Logística y almacén'
  | 'Mantenimiento técnico'
  | 'Construcción'
  | 'Limpieza y servicios'
  | 'Agricultura'
  | 'Recursos Humanos';

export interface JobOffer {
  slug: string;
  title: string;
  category: JobCategory;
  /** Tag amplio para agrupar en el filtro principal: "Hostelería" o el sector industrial. */
  sector: 'Hostelería' | 'Industria' | 'Logística' | 'Construcción' | 'Servicios' | 'Agricultura' | 'RR. HH.';
  type: 'Jornada completa' | 'Media jornada' | 'Por turnos';
  mode: 'Presencial' | 'Teletrabajo' | 'Híbrido';
  countryCode: string;
  countryName: string;
  city?: string;
  icon: LucideIcon;
  shortDescription: string;
  description: string[];
  requirements: string[];
  offer: string[];
  /** Salario aproximado anual o rango. Texto libre. */
  salary?: string;
}

export const JOBS: JobOffer[] = [
  // ════════ COCINA ════════
  {
    slug: 'chef-ejecutivo',
    title: 'Chef ejecutivo/a',
    category: 'Cocina',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / Marbella',
    icon: ChefHat,
    salary: '45.000–70.000 €',
    shortDescription:
      'Lideras la cocina de un grupo hostelero con varios puntos de venta: escandallos, equipo y carta.',
    description: [
      'Grupo hostelero consolidado busca chef ejecutivo/a para coordinar la operación culinaria de 3–5 establecimientos. Responsable de definir la línea gastronómica, escandallar carta, fijar márgenes y liderar al equipo de jefes de cocina.',
      'Reportarás a dirección de operaciones y trabajarás de la mano con compras, F&B y RR. HH. para garantizar consistencia, rentabilidad y cumplimiento normativo en todos los locales.',
    ],
    requirements: [
      'Mínimo 8 años de experiencia, al menos 3 como jefe/a de cocina con responsabilidad de P&L.',
      'Dominio de escandallos, ficheros técnicos y control de food cost.',
      'Capacidad demostrable de liderar equipos de 10+ personas.',
      'Conocimiento APPCC, normativa de alérgenos y trazabilidad.',
    ],
    offer: [
      'Contrato indefinido con plan de bonus por objetivos de rentabilidad.',
      'Coche de empresa o plus desplazamiento entre locales.',
      'Acompañamiento Migria completo: visado, NIE y vivienda los 3 primeros meses.',
      'Proyecto estable con expansión prevista.',
    ],
  },
  {
    slug: 'jefe-de-cocina',
    title: 'Jefe/a de cocina',
    category: 'Cocina',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Valencia / Sevilla',
    icon: ChefHat,
    salary: '32.000–45.000 €',
    shortDescription:
      'Lideras un equipo de 6–12 personas en restaurante de carta, con responsabilidad sobre escandallos y servicio.',
    description: [
      'Restaurante de carta con servicio de mediodía y noche busca jefe/a de cocina para liderar partidas, organizar turnos y mantener la calidad en cada plato. Trabajo directo con segundo de cocina y jefes de partida.',
    ],
    requirements: [
      '5+ años en restaurantes de carta a la española o cocina internacional.',
      'Experiencia liderando equipos de al menos 6 personas.',
      'Manejo de APPCC y normativa de alérgenos.',
      'Disponibilidad horaria de hostelería (turnos partidos y fines de semana).',
    ],
    offer: [
      'Contrato indefinido por encima del convenio.',
      'Festivos compensados + 2 días seguidos de descanso semanal.',
      'Formación continua en cocina española y técnica.',
      'Acompañamiento Migria en la llegada y empadronamiento.',
    ],
  },
  {
    slug: 'segundo-de-cocina',
    title: 'Segundo/a de cocina',
    category: 'Cocina',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: ChefHat,
    salary: '26.000–34.000 €',
    shortDescription:
      'Mano derecha del jefe/a de cocina. Coordinas partidas, mise en place y servicio.',
    description: [
      'Restaurantes y hoteles de toda España buscan segundo/a de cocina con experiencia para sustituir y apoyar al jefe/a de cocina. Coordinación de partidas, supervisión del mise en place y liderazgo durante los servicios.',
    ],
    requirements: [
      '3–5 años en partida con experiencia previa coordinando equipo.',
      'Dominio de mise en place y técnicas básicas de cocina española.',
      'Capacidad para sustituir al jefe/a de cocina en su ausencia.',
      'Trabajo bajo presión durante servicio.',
    ],
    offer: [
      'Contrato indefinido tras prueba.',
      'Promoción interna a jefe/a de cocina en 12–18 meses.',
      'Formación específica en cocina española.',
      'Acompañamiento Migria.',
    ],
  },
  {
    slug: 'jefe-de-partida',
    title: 'Jefe/a de partida',
    category: 'Cocina',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: UtensilsCrossed,
    salary: '22.000–28.000 €',
    shortDescription:
      'Responsable de una partida concreta (caliente, fría, postres, pescados) en servicio de alto volumen.',
    description: [
      'Buscamos jefes/as de partida para restaurantes con servicio de alto volumen. Responsable de la organización, mise en place y emplatado de tu partida durante el servicio.',
    ],
    requirements: [
      '3+ años en partida específica (caliente, fría, postres, pescados o carnes).',
      'Velocidad, limpieza y precisión durante el servicio.',
      'Coordinación con segundo/a y jefe/a de cocina.',
      'Formación profesional en cocina o equivalente.',
    ],
    offer: [
      'Contrato indefinido.',
      'Salario por encima del convenio + plus festivos.',
      'Acompañamiento Migria en la llegada.',
      'Formación interna continua.',
    ],
  },
  {
    slug: 'cocinero',
    title: 'Cocinero/a',
    category: 'Cocina',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: ChefHat,
    salary: '20.000–26.000 €',
    shortDescription:
      'Cocina de alto volumen, conocimiento de cocina internacional y trabajo en partida.',
    description: [
      'Múltiples restaurantes y hoteles españoles buscan cocineros/as con formación técnica y experiencia en cocina de volumen. Trabajo en partida, dominio de mise en place y respeto por estándares de calidad.',
    ],
    requirements: [
      'Formación técnica en cocina (FP, INADEH, SENATI o equivalente).',
      'Mínimo 2 años de experiencia profesional.',
      'Conocimiento de APPCC y normativa de seguridad alimentaria.',
      'Capacidad para trabajar bajo presión en servicio.',
    ],
    offer: [
      'Contrato indefinido tras prueba.',
      'Salario según convenio + plus festivos.',
      'Formación previa al viaje (cocina española, APPCC).',
      'Apoyo Migria en alojamiento y empadronamiento.',
    ],
  },
  {
    slug: 'ayudante-de-cocina',
    title: 'Ayudante de cocina',
    category: 'Cocina',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: Soup,
    salary: '18.000–21.000 €',
    shortDescription:
      'Apoyo en mise en place, preparaciones básicas y limpieza durante el servicio.',
    description: [
      'Incorporación inmediata para ayudantes de cocina en restaurantes y hoteles. Posición ideal para perfiles con experiencia básica que quieren crecer dentro de la brigada española.',
    ],
    requirements: [
      'Experiencia básica en cocina profesional (mínimo 1 año).',
      'Actitud, orden y ganas de aprender.',
      'Disponibilidad de turnos partidos y fines de semana.',
      'Curso de manipulador de alimentos (lo gestionamos si no lo tienes).',
    ],
    offer: [
      'Contrato indefinido con plan de crecimiento a cocinero/a.',
      'Salario según convenio + plus.',
      'Formación inicial pagada.',
      'Acompañamiento Migria completo.',
    ],
  },
  {
    slug: 'pastelero',
    title: 'Pastelero/a',
    category: 'Café y pastelería',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / País Vasco',
    icon: Cookie,
    salary: '24.000–32.000 €',
    shortDescription:
      'Elaboración de postres y bollería para restaurantes, hoteles y obradores.',
    description: [
      'Restaurantes con carta de postres propia y obradores buscan pasteleros/as con experiencia en elaboración de masas, cremas y postres de plato emplatado.',
    ],
    requirements: [
      'Formación técnica en pastelería.',
      '3+ años de experiencia en pastelería profesional o restaurante.',
      'Dominio de masas, cremas, helados y chocolate.',
      'Atención al detalle en emplatado.',
    ],
    offer: [
      'Contrato indefinido.',
      'Horario continuo de mañana (ideal conciliación).',
      'Formación continua en técnicas modernas.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ SALA Y SERVICIO ════════
  {
    slug: 'jefe-de-sala',
    title: 'Jefe/a de sala',
    category: 'Sala y servicio',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / Costa',
    icon: Wine,
    salary: '28.000–40.000 €',
    shortDescription:
      'Liderazgo del equipo de sala, atención a cliente VIP y coordinación con cocina.',
    description: [
      'Restaurante de cocina de autor busca jefe/a de sala con experiencia en establecimientos de alto nivel. Liderazgo del equipo de sala (6-10 personas), gestión de reservas, coordinación con cocina y atención personalizada a clientela exigente.',
    ],
    requirements: [
      'Mínimo 5 años en sala de restaurantes premium.',
      'Liderazgo de equipos de hostelería.',
      'Conocimiento de protocolo, vinos y maridajes.',
      'Inglés conversacional (otros idiomas valorables).',
      'Trato exquisito con cliente.',
    ],
    offer: [
      'Contrato indefinido tras prueba.',
      'Salario por encima del convenio + propinas + variable.',
      'Equipo profesional con cocina reconocida.',
      'Plan de formación en sumillería.',
    ],
  },
  {
    slug: 'sumiller',
    title: 'Sumiller',
    category: 'Sala y servicio',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / Logroño',
    icon: Wine,
    salary: '30.000–45.000 €',
    shortDescription:
      'Carta de vinos, maridajes y recomendación personalizada en restaurante gastronómico.',
    description: [
      'Restaurante con estrella Michelin o sello Repsol busca sumiller para liderar la carta de vinos, gestión de bodega y atención personalizada al cliente en el maridaje.',
    ],
    requirements: [
      'Certificación oficial de sumiller (WSET, Court of Master Sommeliers o equivalente).',
      'Experiencia en restaurantes gastronómicos.',
      'Conocimiento profundo de vinos españoles y europeos.',
      'Inglés profesional.',
    ],
    offer: [
      'Contrato indefinido + plus por categoría del restaurante.',
      'Acceso a catas, formaciones y eventos del sector.',
      'Equipo profesional con cocina reconocida.',
      'Acompañamiento Migria.',
    ],
  },
  {
    slug: 'camarero',
    title: 'Camarero/a',
    category: 'Sala y servicio',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: UtensilsCrossed,
    salary: '18.000–24.000 €',
    shortDescription:
      'Atención al cliente, servicio en mesa y gestión de comandas con TPV.',
    description: [
      'Restaurantes, cafeterías y hoteles buscan camareros/as con experiencia en sala. Atención al cliente, servicio en mesa, gestión de comandas con TPV y mantenimiento del orden y la higiene en zona de servicio.',
    ],
    requirements: [
      'Experiencia previa como camarero/a (mínimo 1 año).',
      'Trato amable con cliente y orientación al servicio.',
      'Conocimiento básico de TPV y bandeja.',
      'Disponibilidad para fines de semana y festivos.',
    ],
    offer: [
      'Contrato indefinido (jornada parcial o completa según disponibilidad).',
      'Salario según convenio + propinas.',
      'Estabilidad en empresas con alta retención.',
      'Formación interna.',
    ],
  },
  {
    slug: 'runner',
    title: 'Runner / Ayudante de sala',
    category: 'Sala y servicio',
    sector: 'Hostelería',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: Sandwich,
    salary: '16.500–19.500 €',
    shortDescription:
      'Apoyo en sala: traslado de bandejas, repaso de mesa y soporte al camarero.',
    description: [
      'Posición de entrada en sala. Ideal para perfiles que quieren iniciar carrera en hostelería con plan de crecimiento a camarero/a en 6–12 meses.',
    ],
    requirements: [
      'No se requiere experiencia previa.',
      'Buena actitud y velocidad bajo presión.',
      'Disponibilidad de turnos.',
      'Curso de manipulador de alimentos (lo gestionamos).',
    ],
    offer: [
      'Contrato indefinido con plan de carrera.',
      'Promoción interna a camarero/a tras 6–12 meses.',
      'Formación inicial pagada.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ BARRA Y COCTELERÍA ════════
  {
    slug: 'barman',
    title: 'Barman / Bartender',
    category: 'Barra y coctelería',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / Ibiza',
    icon: GlassWater,
    salary: '22.000–32.000 €',
    shortDescription:
      'Coctelería clásica y de autor en bares de hotel y cocteleria de referencia.',
    description: [
      'Hoteles boutique y bares de coctelería referente buscan bartenders con dominio técnico de coctelería clásica y de autor. Servicio en barra alta rotación con cliente internacional.',
    ],
    requirements: [
      '3+ años en barra de coctelería profesional.',
      'Dominio de coctelería clásica y técnicas modernas.',
      'Inglés conversacional (idiomas adicionales valorables).',
      'Capacidad para construir relación con cliente habitual.',
    ],
    offer: [
      'Contrato indefinido + propinas.',
      'Formación pagada en eventos y catas del sector.',
      'Posibilidad de migrar entre temporadas (Ibiza ↔ Madrid).',
      'Acompañamiento Migria.',
    ],
  },
  {
    slug: 'barista',
    title: 'Barista de especialidad',
    category: 'Café y pastelería',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / Valencia',
    icon: Coffee,
    salary: '20.000–26.000 €',
    shortDescription:
      'Café de especialidad: extracción, métodos filtrados y latte art.',
    description: [
      'Cafeterías de especialidad buscan baristas con dominio técnico de extracción (espresso, métodos filtrados, V60, Chemex) y latte art. Trato directo con cliente y conocimiento del producto.',
    ],
    requirements: [
      '2+ años como barista profesional.',
      'Dominio del latte art (rosetta, tulipán, cisne).',
      'Conocimiento de origen y proceso del café.',
      'Trato amable y cercano con cliente.',
    ],
    offer: [
      'Contrato indefinido + propinas.',
      'Formación continua en catas y técnica.',
      'Horario continuo de mañana o tarde (sin turnos partidos).',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ HOTEL Y ALOJAMIENTO ════════
  {
    slug: 'recepcionista-hotel',
    title: 'Recepcionista de hotel',
    category: 'Hotelería y alojamiento',
    sector: 'Hostelería',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / Costa',
    icon: HotelDesk,
    salary: '20.000–26.000 €',
    shortDescription:
      'Check-in/check-out, atención telefónica, gestión de reservas y resolución de incidencias.',
    description: [
      'Cadenas hoteleras 4* y 5* buscan recepcionistas con idiomas. Gestión de check-in/out, atención telefónica, coordinación con housekeeping y resolución de incidencias del huésped.',
    ],
    requirements: [
      'Experiencia previa en recepción (1+ año).',
      'Inglés profesional obligatorio. Otros idiomas muy valorables.',
      'Manejo de PMS (Opera, Protel o similar).',
      'Disponibilidad de turnos rotativos (incluyendo noche).',
    ],
    offer: [
      'Contrato indefinido + plus turno de noche.',
      'Posibilidad de movilidad entre hoteles del grupo.',
      'Formación continua y plan de carrera.',
      'Acompañamiento Migria.',
    ],
  },
  {
    slug: 'gobernanta',
    title: 'Gobernanta / Camarera de pisos',
    category: 'Hotelería y alojamiento',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Costa y zonas turísticas',
    icon: BedDouble,
    salary: '19.000–23.000 €',
    shortDescription:
      'Limpieza de habitaciones, gestión de lencería y coordinación con recepción.',
    description: [
      'Hoteles vacacionales y urbanos buscan camareras/os de pisos con experiencia. Limpieza de habitaciones, atención al huésped, gestión de minibar y coordinación con gobernanta.',
    ],
    requirements: [
      'Experiencia previa en limpieza de habitaciones de hotel.',
      'Atención al detalle y rapidez.',
      'Trato cordial con huésped.',
      'Disponibilidad fines de semana.',
    ],
    offer: [
      'Contrato indefinido (fijo discontinuo si zona vacacional).',
      'Salario según convenio + plus rendimiento.',
      'Alojamiento subvencionado en zonas turísticas.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ HOSTELERÍA OPERACIONES ════════
  {
    slug: 'supervisor-restaurante',
    title: 'Supervisor/a de restaurante',
    category: 'Hostelería · operaciones',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Cadenas nacionales',
    icon: Briefcase,
    salary: '28.000–38.000 €',
    shortDescription:
      'Coordinas 2–4 restaurantes de una cadena: P&L, equipo, estándares y proveedores.',
    description: [
      'Cadenas de restauración organizada buscan supervisores/as de área para coordinar varios locales. Responsable de P&L por local, supervisión de operativa, formación de encargados y cumplimiento de estándares de marca.',
    ],
    requirements: [
      '5+ años en restauración con experiencia previa como encargado/a.',
      'Capacidad analítica para leer P&L y plan de acción.',
      'Disponibilidad para visitar locales (carnet B).',
      'Liderazgo de equipos distribuidos.',
    ],
    offer: [
      'Contrato indefinido + variable por objetivos.',
      'Coche de empresa o plus desplazamiento.',
      'Plan de carrera a dirección regional.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ INDUSTRIA ALIMENTARIA ════════
  {
    slug: 'pescadero-senior',
    title: 'Pescadero/a senior',
    category: 'Pescadería y carnicería',
    sector: 'Industria',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Barcelona / Valencia',
    icon: Fish,
    salary: '22.000–28.000 €',
    shortDescription:
      'Especialista en corte, fileteado y atención al cliente en pescadería de alta rotación.',
    description: [
      'Cadena de supermercados premium busca pescadero/a senior con experiencia demostrable en corte, limpieza y fileteado de pescado fresco. Atención directa al cliente y gestión de mostrador en establecimientos de alta rotación.',
    ],
    requirements: [
      'Mínimo 5 años de experiencia como pescadero.',
      'Dominio técnico del corte, fileteado y presentación.',
      'Trato directo con cliente final.',
      'Manejo de cámara fría y normativa APPCC.',
    ],
    offer: [
      'Salario por encima del convenio.',
      'Contrato indefinido.',
      'Estabilidad y crecimiento dentro de la cadena.',
      'Formación continua en producto y técnica.',
    ],
  },
  {
    slug: 'carnicero',
    title: 'Carnicero/a',
    category: 'Pescadería y carnicería',
    sector: 'Industria',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: UtensilsCrossed,
    salary: '21.000–27.000 €',
    shortDescription:
      'Despiece, fileteado y atención al cliente en carnicería de supermercado o tradicional.',
    description: [
      'Carnicerías tradicionales y supermercados premium buscan carniceros/as con experiencia en despiece, preparación y atención al cliente. Conocimiento de cortes españoles y trazabilidad obligatorio.',
    ],
    requirements: [
      '3+ años como carnicero/a.',
      'Dominio del despiece y técnicas de presentación.',
      'Conocimiento de cortes españoles (chuletón, secreto, presa, etc.).',
      'Normativa APPCC.',
    ],
    offer: [
      'Contrato indefinido por encima del convenio.',
      'Estabilidad y antigüedad recompensada.',
      'Formación continua.',
      'Acompañamiento Migria.',
    ],
  },
  {
    slug: 'supervisor-de-turno-de-produccion',
    title: 'Supervisor/a de turno de producción',
    category: 'Industria alimentaria',
    sector: 'Industria',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Cataluña / Levante',
    icon: Warehouse,
    salary: '28.000–36.000 €',
    shortDescription:
      'Gestión de equipos en planta, control de calidad y cumplimiento de objetivos productivos.',
    description: [
      'Empresa industrial española busca supervisor/a de turno con experiencia en planta para liderar equipos de 10-20 personas. Responsable de coordinar el turno, garantizar el cumplimiento de objetivos productivos y velar por la calidad y seguridad.',
    ],
    requirements: [
      'Experiencia mínima 3 años como supervisor en planta industrial.',
      'Conocimiento de sistemas de gestión de calidad (ISO 9001).',
      'Liderazgo de equipos y comunicación efectiva.',
      'Disponibilidad para trabajar a turnos rotativos.',
    ],
    offer: [
      'Contrato indefinido tras periodo de prueba.',
      'Salario según convenio + plus de turnicidad.',
      'Formación continua en sistemas de gestión.',
      'Posibilidades reales de promoción interna.',
    ],
  },
  {
    slug: 'operario-de-produccion',
    title: 'Operario/a de producción',
    category: 'Industria alimentaria',
    sector: 'Industria',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Varias provincias',
    icon: Warehouse,
    salary: '18.000–22.000 €',
    shortDescription:
      'Trabajo en línea de producción, manipulación de maquinaria y control de proceso.',
    description: [
      'Empresas industriales en distintas provincias de España demandan operarios/as de producción para incorporación inmediata. Trabajo en línea, manipulación de maquinaria semiautomática, control de calidad in situ.',
    ],
    requirements: [
      'Experiencia previa en planta industrial (deseable).',
      'Capacidad para trabajar a turnos rotativos.',
      'Atención al detalle y cumplimiento de protocolos.',
      'Ganas de estabilidad y crecimiento profesional.',
    ],
    offer: [
      'Contrato indefinido tras prueba.',
      'Salario según convenio + plus.',
      'Cursos de formación incluidos (PRL, manejo de maquinaria).',
      'Plantilla estable, alta retención.',
    ],
  },

  // ════════ LOGÍSTICA ════════
  {
    slug: 'mozo-almacen',
    title: 'Mozo/a de almacén',
    category: 'Logística y almacén',
    sector: 'Logística',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Polígonos industriales',
    icon: Truck,
    salary: '18.000–22.000 €',
    shortDescription:
      'Carga, descarga, preparación de pedidos y manejo de carretilla.',
    description: [
      'Operadores logísticos buscan mozos/as para preparación de pedidos, carga y descarga, ubicación en estanterías y manejo de carretilla retráctil o frontal.',
    ],
    requirements: [
      'Experiencia previa en almacén (deseable).',
      'Carnet de carretillero/a vigente (lo gestionamos si no lo tienes).',
      'Disponibilidad turnos rotativos.',
      'Trabajo físico continuado.',
    ],
    offer: [
      'Contrato indefinido.',
      'Plus de turnicidad y nocturnidad.',
      'Formación pagada (carretillero, PRL).',
      'Acompañamiento Migria.',
    ],
  },
  {
    slug: 'preparador-pedidos-frio',
    title: 'Preparador/a de pedidos en frío',
    category: 'Logística y almacén',
    sector: 'Logística',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Madrid / Cataluña / Valencia',
    icon: Snowflake,
    salary: '20.000–25.000 €',
    shortDescription:
      'Preparación de pedidos en cámaras refrigeradas y congeladas para distribución alimentaria.',
    description: [
      'Operadores logísticos del sector alimentario buscan preparadores/as para trabajar en cámaras frigoríficas y de congelación (hasta -25 ºC). Trabajo con voice picking o PDA.',
    ],
    requirements: [
      'Experiencia previa en almacén alimentario o logística (deseable).',
      'Disposición a trabajar en bajas temperaturas (EPI proporcionado).',
      'Disponibilidad turnos.',
      'Curso de manipulador de alimentos.',
    ],
    offer: [
      'Contrato indefinido.',
      'Plus de bajas temperaturas + turnicidad.',
      'EPI completo proporcionado.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ MANTENIMIENTO ════════
  {
    slug: 'tecnico-de-mantenimiento',
    title: 'Técnico/a de mantenimiento',
    category: 'Mantenimiento técnico',
    sector: 'Industria',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Polígonos industriales nacionales',
    icon: Wrench,
    salary: '24.000–32.000 €',
    shortDescription:
      'Mantenimiento preventivo y correctivo de instalaciones industriales.',
    description: [
      'Empresa industrial busca técnico/a de mantenimiento con experiencia en mantenimiento preventivo y correctivo de instalaciones, maquinaria y sistemas auxiliares (electricidad, neumática, hidráulica).',
    ],
    requirements: [
      'FP de grado medio/superior en electromecánica, electricidad o similar.',
      'Mínimo 3 años de experiencia en mantenimiento industrial.',
      'Conocimiento de PLC, autómatas y variadores (valorable).',
      'Disponibilidad para guardias eventuales.',
    ],
    offer: [
      'Contrato indefinido.',
      'Salario competitivo según experiencia.',
      'Formación continua certificada.',
      'Plan de carrera estructurado.',
    ],
  },
  {
    slug: 'tecnico-mantenimiento-hotelero',
    title: 'Técnico/a de mantenimiento hotelero',
    category: 'Mantenimiento técnico',
    sector: 'Hostelería',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Costa y ciudades',
    icon: Hammer,
    salary: '22.000–28.000 €',
    shortDescription:
      'Mantenimiento integral en hoteles: fontanería, electricidad, climatización y pequeña albañilería.',
    description: [
      'Cadenas hoteleras buscan técnicos/as polivalentes para mantenimiento de instalaciones. Trabajo de fontanería, electricidad básica, climatización y resolución de incidencias diarias en habitaciones.',
    ],
    requirements: [
      'FP en electromecánica, electricidad o similar.',
      '2+ años en mantenimiento polivalente (industrial u hotelero).',
      'Carnet de carretillero o plataformas elevadoras (valorable).',
      'Carnet de conducir.',
    ],
    offer: [
      'Contrato indefinido.',
      'Posible alojamiento si zona vacacional.',
      'Formación en sistemas específicos del grupo.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ CONSTRUCCIÓN ════════
  {
    slug: 'oficial-construccion',
    title: 'Oficial 1ª de construcción',
    category: 'Construcción',
    sector: 'Construcción',
    type: 'Jornada completa',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Toda España',
    icon: Hammer,
    salary: '24.000–32.000 €',
    shortDescription:
      'Albañilería, alicatado, encofrado y acabados en obra residencial y reformas.',
    description: [
      'Constructoras y empresas de reformas buscan oficiales 1ª con experiencia en albañilería, alicatado, encofrado y acabados. Obra residencial nueva y rehabilitación.',
    ],
    requirements: [
      '5+ años como oficial de construcción.',
      'Tarjeta Profesional de Construcción (TPC) — la gestionamos si falta.',
      'Conocimiento de pladur, alicatado y acabados.',
      'Trabajo en equipo y bajo plazos.',
    ],
    offer: [
      'Contrato indefinido por convenio + plus productividad.',
      'EPI completo.',
      'Cursos PRL obligatorios pagados.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ LIMPIEZA ════════
  {
    slug: 'tecnico-limpieza-industrial',
    title: 'Técnico/a de limpieza industrial',
    category: 'Limpieza y servicios',
    sector: 'Servicios',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Polígonos industriales',
    icon: Sparkles,
    salary: '18.000–22.000 €',
    shortDescription:
      'Limpieza técnica en plantas alimentarias y farmacéuticas con protocolos APPCC.',
    description: [
      'Empresas de limpieza especializadas en industria buscan técnicos/as para limpieza de líneas alimentarias, salas blancas y entornos farmacéuticos. Trabajo con maquinaria a presión y productos químicos profesionales.',
    ],
    requirements: [
      'Experiencia previa en limpieza profesional (deseable).',
      'Disponibilidad turnos nocturnos (la limpieza se hace al cierre).',
      'Curso PRL y APPCC (los gestionamos).',
      'Capacidad física para trabajo continuado.',
    ],
    offer: [
      'Contrato indefinido + plus nocturnidad.',
      'EPI completo y formación.',
      'Estabilidad y horario fijo.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ AGRICULTURA ════════
  {
    slug: 'tecnico-agrario',
    title: 'Técnico/a agrario en campo',
    category: 'Agricultura',
    sector: 'Agricultura',
    type: 'Por turnos',
    mode: 'Presencial',
    countryCode: 'ES',
    countryName: 'España',
    city: 'Almería / Murcia / Huelva',
    icon: Wheat,
    salary: '20.000–26.000 €',
    shortDescription:
      'Trabajo en invernaderos y plantaciones intensivas: recolección, manejo y control.',
    description: [
      'Empresas agrícolas de Almería, Murcia y Huelva buscan técnicos/as para invernaderos y plantaciones intensivas. Recolección, manejo de cultivos, control de plagas y supervisión de equipos pequeños.',
    ],
    requirements: [
      'Experiencia previa en agricultura intensiva.',
      'Conocimiento básico de plagas y fitosanitarios.',
      'Carnet de conducir (valorable).',
      'Disponibilidad de horarios estacionales.',
    ],
    offer: [
      'Contrato fijo discontinuo + posibilidad indefinido.',
      'Alojamiento subvencionado.',
      'Formación en cultivos.',
      'Acompañamiento Migria.',
    ],
  },

  // ════════ RECURSOS HUMANOS ════════
  {
    slug: 'recruiter',
    title: 'Recruiter de talento internacional',
    category: 'Recursos Humanos',
    sector: 'RR. HH.',
    type: 'Jornada completa',
    mode: 'Teletrabajo',
    countryCode: 'PE',
    countryName: 'Perú',
    city: 'Lima',
    icon: Users,
    salary: '$1.800–$2.500 USD',
    shortDescription:
      'Identificación y selección de talento hispanoamericano para empresas españolas.',
    description: [
      'Buscamos un/a recruiter con experiencia en captación internacional para incorporarse a nuestro equipo en Perú. Tu misión será identificar, evaluar y acompañar a candidatos peruanos en su proceso de movilidad laboral hacia España.',
      'Trabajarás de la mano del equipo de operaciones en España, gestionando todo el ciclo desde la primera entrevista hasta el día que la persona viaja con su contrato firmado y su visado en regla.',
    ],
    requirements: [
      'Experiencia previa en reclutamiento o selección (mínimo 2 años).',
      'Excelente comunicación y empatía con candidatos en proceso migratorio.',
      'Conocimiento básico de procesos legales y migratorios (deseable).',
      'Capacidad de trabajo autónomo y orientación a resultados.',
      'Manejo fluido de herramientas digitales (Notion, Slack, Zoom, ATS).',
    ],
    offer: [
      'Contrato a jornada completa, 100% teletrabajo desde Perú.',
      'Salario competitivo + variable por procesos cerrados.',
      'Formación continua en migración laboral y normativa española.',
      'Equipo joven, multicultural y con propósito.',
    ],
  },
];

export function getJobBySlug(slug: string): JobOffer | undefined {
  return JOBS.find((j) => j.slug === slug);
}

export function getRelatedJobs(slug: string, count = 3): JobOffer[] {
  const current = getJobBySlug(slug);
  if (!current) return JOBS.slice(0, count);
  // Prioriza misma categoría, luego mismo sector
  const sameCat = JOBS.filter((j) => j.slug !== slug && j.category === current.category);
  const sameSector = JOBS.filter(
    (j) => j.slug !== slug && j.sector === current.sector && j.category !== current.category
  );
  return [...sameCat, ...sameSector].slice(0, count);
}

export const SECTORS = [
  'Todos',
  'Hostelería',
  'Industria',
  'Logística',
  'Construcción',
  'Servicios',
  'Agricultura',
  'RR. HH.',
] as const;

export type SectorFilter = (typeof SECTORS)[number];
