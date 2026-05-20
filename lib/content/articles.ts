/**
 * Artículos del blog Migria. Fuente: migriajob.com/noticias.
 * Cuerpo redactado con la información real disponible y referencias verificadas.
 */

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'callout'; title: string; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingMinutes: number;
  hero: string; // gradient classes
  body: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: '3-tipos-de-permiso-de-trabajo',
    title: '3 tipos de permiso de trabajo en España que debes conocer',
    excerpt:
      'Descubre los 3 tipos de permiso de trabajo en España que debes conocer para trabajar legalmente: por cuenta ajena, por cuenta propia y la Tarjeta Azul UE.',
    category: 'Permiso de trabajo',
    date: '2026-02-13',
    readingMinutes: 6,
    hero: 'from-primary-soft to-accent-warm/20',
    body: [
      { type: 'p', text: 'Trabajar legalmente en España siendo extranjero requiere obtener una autorización de trabajo y residencia. La normativa española contempla varias modalidades en función del tipo de actividad, la nacionalidad y el perfil del trabajador. Conocer cuál te corresponde es el primer paso para evitar problemas legales y garantizar tu estabilidad.' },
      { type: 'h2', text: '1. Permiso de trabajo por cuenta ajena' },
      { type: 'p', text: 'Es el más habitual. Lo solicita la empresa española que quiere contratarte cuando aún resides fuera de la Unión Europea. La oferta de empleo debe figurar en el catálogo de ocupaciones de difícil cobertura del Servicio Público de Empleo Estatal o cumplir requisitos específicos.' },
      { type: 'ul', items: [
        'Lo solicita la empresa contratante en España.',
        'Vinculado a un contrato de trabajo concreto.',
        'Vigencia inicial de 1 año, renovable.',
        'Permite trabajar exclusivamente para esa empresa, en esa ocupación y provincia.',
      ]},
      { type: 'h2', text: '2. Permiso de trabajo por cuenta propia' },
      { type: 'p', text: 'Pensado para emprendedores y autónomos. Requiere demostrar la viabilidad del proyecto, contar con titulación y experiencia, y disponer de recursos económicos suficientes. La administración valora el impacto del proyecto en la economía local.' },
      { type: 'ul', items: [
        'Necesitas memoria del proyecto, presupuesto y plan de inversión.',
        'Demostrar experiencia y formación en el sector.',
        'Cumplir requisitos de inversión mínima según actividad.',
        'Inscripción en el régimen especial de trabajadores autónomos (RETA).',
      ]},
      { type: 'h2', text: '3. Tarjeta Azul UE' },
      { type: 'p', text: 'Para profesionales altamente cualificados. Está pensada para puestos que requieren titulación universitaria o experiencia equivalente, y ofrece ventajas significativas frente al permiso por cuenta ajena.' },
      { type: 'ul', items: [
        'Salario mínimo establecido por encima del salario medio español.',
        'Permiso inicial de 1-4 años, renovable.',
        'Movilidad facilitada dentro de la UE.',
        'Reagrupación familiar más sencilla.',
      ]},
      { type: 'callout', title: 'Migria te acompaña', text: 'Cada modalidad tiene sus tiempos, requisitos y costes. En MIGRIA gestionamos el expediente completo ante extranjería y la Embajada de España en tu país, para que tú solo tengas que preocuparte de prepararte para tu nuevo empleo.' },
    ],
  },
  {
    slug: 'movilidad-laboral-en-espana-2',
    title: 'Movilidad laboral en España: 3 beneficios de viajar con un contrato de origen firmado',
    excerpt:
      'Beneficios de la contratación en origen para peruanos. Asegura tu movilidad laboral en España con contrato firmado, seguridad social y visado legal.',
    category: 'Movilidad laboral',
    date: '2026-02-13',
    readingMinutes: 5,
    hero: 'from-info-soft to-primary-soft',
    body: [
      { type: 'p', text: 'Viajar a España con un contrato de origen firmado no es lo mismo que viajar como turista y buscar trabajo allí. Es la diferencia entre llegar con todo en regla o jugártela. Estos son los tres beneficios principales de hacerlo con contrato firmado en origen.' },
      { type: 'h2', text: '1. Seguridad legal desde el primer día' },
      { type: 'p', text: 'Con contrato de origen firmado, tu visado de trabajo se tramita ANTES del viaje en la Embajada de España de tu país. Llegas con autorización de trabajo, alta en Seguridad Social desde el día uno y cobertura sanitaria pública. Sin riesgo de irregularidad, sin tener que esconderte, sin presión por cubrir gastos sin ingresos.' },
      { type: 'h2', text: '2. Estabilidad económica' },
      { type: 'p', text: 'Sabes exactamente cuánto vas a cobrar, en qué condiciones y con qué horario. El contrato de trabajo está sujeto a la legislación española, lo que garantiza salario mínimo, vacaciones pagadas, derecho a indemnización por despido y prestación por desempleo si cotizas el mínimo exigido.' },
      { type: 'h2', text: '3. Acompañamiento real, no promesas' },
      { type: 'p', text: 'Cuando viajas con un partner como MIGRIA tienes recepción en aeropuerto, traslado a tu empresa, búsqueda de alojamiento, kit de bienvenida con tarjeta SIM, gestión del empadronamiento y seguimiento durante tus primeros meses. La integración no es algo que te toca resolver solo: es parte del servicio.' },
      { type: 'callout', title: 'Importante', text: 'Aceptar ofertas que no incluyan contrato de origen firmado y visado tramitado por la empresa contratante es la principal causa de fraudes y situaciones irregulares para trabajadores latinoamericanos. Verifica siempre.' },
    ],
  },
  {
    slug: '4-etapas-del-proceso-de-empleo-en-el-extranjero',
    title: '4 etapas del proceso de empleo en el extranjero con acompañamiento profesional',
    excerpt:
      'Las 4 etapas clave del proceso de empleo en el extranjero con acompañamiento profesional: desde la preparación hasta la adaptación en tu nuevo país.',
    category: 'Empleo en el extranjero',
    date: '2026-02-13',
    readingMinutes: 7,
    hero: 'from-success-soft to-info-soft',
    body: [
      { type: 'p', text: 'Salir a trabajar al extranjero no es solo "encontrar una oferta y subirse al avión". Hacerlo con acompañamiento profesional implica un proceso estructurado de cuatro fases que minimiza riesgos y maximiza la probabilidad de éxito.' },
      { type: 'h2', text: 'Etapa 1: Preparación y validación' },
      { type: 'p', text: 'Antes de cualquier oferta concreta, se evalúa tu perfil profesional, experiencia, idiomas, estado documental y motivación. Se identifican brechas formativas (cursos APPCC, manipulador de alimentos, inglés funcional) y se diseña un plan personalizado.' },
      { type: 'ul', items: [
        'Entrevista de evaluación de competencias.',
        'Revisión de CV y trayectoria.',
        'Validación documental (DNI, antecedentes, títulos).',
        'Plan de formación previa según el puesto objetivo.',
      ]},
      { type: 'h2', text: 'Etapa 2: Selección y oferta' },
      { type: 'p', text: 'Con tu perfil ya validado, te presentamos a empresas españolas que encajan con tu experiencia. Las entrevistas son por videollamada y, si hay match, recibes una propuesta laboral concreta con salario, horario y condiciones.' },
      { type: 'h2', text: 'Etapa 3: Trámites legales y migratorios' },
      { type: 'p', text: 'Una vez firmado el preacuerdo, se inicia el expediente ante la oficina de extranjería competente en España. Cuando se aprueba, acudes a la Embajada de España en tu país a recoger el visado de trabajo. Este proceso puede tardar entre 2 y 6 meses.' },
      { type: 'ol', items: [
        'Tramitación del expediente ante extranjería.',
        'Resolución favorable.',
        'Cita en la Embajada de España de tu país.',
        'Recogida del visado.',
      ]},
      { type: 'h2', text: 'Etapa 4: Viaje, llegada e integración' },
      { type: 'p', text: 'Llegada a España con todo gestionado: vuelo, recepción en aeropuerto, traslado a la empresa, alojamiento inicial y kit de bienvenida. En los primeros 6 meses recibes seguimiento periódico para asegurar que la integración va bien tanto en lo laboral como en lo personal.' },
    ],
  },
  {
    slug: 'movilidad-laboral-en-espana',
    title: 'Guía 2026: Cómo acceder a la movilidad laboral en España si vives en Perú',
    excerpt:
      'Guía completa 2026 para peruanos: cómo acceder a la movilidad laboral en España. Requisitos, trámites en el Consulado de Lima y consejos para trabajar legalmente.',
    category: 'Movilidad laboral',
    date: '2026-02-13',
    readingMinutes: 8,
    hero: 'from-primary-soft to-success-soft',
    body: [
      { type: 'p', text: 'España y Perú comparten lazos históricos, idioma y cultura. Esa afinidad facilita la movilidad laboral, pero los trámites siguen requiriendo orden y planificación. Esta es la guía paso a paso actualizada para 2026.' },
      { type: 'h2', text: 'Requisitos básicos' },
      { type: 'ul', items: [
        'DNI peruano vigente y pasaporte con al menos 6 meses de validez.',
        'Antecedentes penales en regla (Perú y, si aplica, otros países donde residiste).',
        'Certificado médico oficial reciente.',
        'Oferta de trabajo formal en España con visado tramitado.',
        'Titulación o experiencia demostrable en el sector.',
      ]},
      { type: 'h2', text: 'El papel del Consulado de España en Lima' },
      { type: 'p', text: 'Una vez tu empleador ha tramitado y obtenido la autorización de residencia y trabajo en España, recibirás una comunicación. Con esa resolución y el resto de documentos, debes solicitar cita en el Consulado General de España en Lima para tu visado de trabajo.' },
      { type: 'h3', text: 'Documentos a presentar' },
      { type: 'ul', items: [
        'Pasaporte original y copias.',
        'Resolución favorable de autorización emitida en España.',
        'Antecedentes penales legalizados.',
        'Certificado médico.',
        'Justificación de pago de tasas consulares.',
      ]},
      { type: 'h2', text: 'Tiempos realistas' },
      { type: 'p', text: 'Desde la oferta inicial hasta tu llegada a España suelen pasar entre 3 y 6 meses. Los plazos dependen de la carga de trabajo de extranjería y del Consulado, así que la paciencia y la planificación son clave.' },
      { type: 'h2', text: 'Consejos para no equivocarte' },
      { type: 'ul', items: [
        'Desconfía de "agencias" que cobran por adelantado sin contrato firmado.',
        'Verifica siempre que la empresa española exista y esté activa.',
        'Pide ver la resolución de extranjería antes de pagar nada.',
        'Lee tu contrato completo: salario, jornada, lugar de trabajo, duración.',
      ]},
      { type: 'callout', title: 'Cómo te ayuda Migria', text: 'En MIGRIA gestionamos el proceso completo: empresa española, contrato, expediente de extranjería, visado y aterrizaje. Trabajamos con consultoras legales certificadas en Perú y España.' },
    ],
  },
  {
    slug: '8-preguntas-frecuentes-sobre-empleo-en-el-extranjero',
    title: '8 preguntas frecuentes sobre empleo en el extranjero que debes conocer',
    excerpt:
      '8 preguntas frecuentes sobre empleo en el extranjero: requisitos legales, prestaciones sociales, documentos, idiomas y consejos clave para trabajar fuera con seguridad.',
    category: 'Empleo en el extranjero',
    date: '2026-02-13',
    readingMinutes: 8,
    hero: 'from-warning-soft to-accent-warm/20',
    body: [
      { type: 'p', text: 'Cuando alguien empieza a plantearse trabajar fuera, surgen siempre las mismas dudas. Aquí respondemos las 8 más comunes con datos verificados.' },
      { type: 'h2', text: '1. ¿Necesito hablar inglés para trabajar en España?' },
      { type: 'p', text: 'No de forma obligatoria, salvo en algunos puestos del sector turismo o tecnología. La mayoría de las ofertas en hostelería, construcción, agricultura o cuidados se desarrollan íntegramente en español.' },
      { type: 'h2', text: '2. ¿Cobraré igual que un trabajador español?' },
      { type: 'p', text: 'Sí. La ley laboral española prohíbe expresamente discriminar por nacionalidad. Aplica el mismo convenio colectivo, mismo salario y mismas condiciones que a cualquier compañero español.' },
      { type: 'h2', text: '3. ¿Tendré derecho a Seguridad Social desde el primer día?' },
      { type: 'p', text: 'Sí. Tu empresa debe darte de alta en la Seguridad Social desde el inicio del contrato. Eso te da acceso a sanidad pública, prestaciones y cotización para tu jubilación.' },
      { type: 'h2', text: '4. ¿Puedo viajar con mi familia?' },
      { type: 'p', text: 'Una vez tengas residencia legal en España y un mínimo de tiempo trabajando, puedes solicitar la reagrupación familiar de cónyuge e hijos menores. Cada caso tiene requisitos propios.' },
      { type: 'h2', text: '5. ¿Qué documentos necesito antes de viajar?' },
      { type: 'p', text: 'Pasaporte vigente, antecedentes penales legalizados, certificado médico, contrato de trabajo firmado y visado expedido por la Embajada de España.' },
      { type: 'h2', text: '6. ¿Cuánto cuesta el proceso?' },
      { type: 'p', text: 'Las tasas oficiales de visado y extranjería rondan los 300-500€ en total. Cuando trabajas con MIGRIA, los costes de tramitación legal están incluidos en el servicio acordado con la empresa contratante.' },
      { type: 'h2', text: '7. ¿Qué pasa si pierdo el empleo en España?' },
      { type: 'p', text: 'Si has cotizado el mínimo (12 meses), tienes derecho a prestación por desempleo. Hay además subsidios y ayudas autonómicas para situaciones de transición. Tu autorización de residencia se puede renovar aunque cambies de trabajo.' },
      { type: 'h2', text: '8. ¿Cómo me adapto culturalmente?' },
      { type: 'p', text: 'La afinidad cultural España-Latam facilita mucho la integración. Recomendamos involucrarse en asociaciones de migrantes locales, mantener red familiar de apoyo y aprovechar los servicios sociales públicos.' },
    ],
  },
  {
    slug: 'empleo-en-el-extranjero-sin-asesoramiento',
    title: '4 riesgos comunes al aceptar empleo en el extranjero sin asesoramiento profesional',
    excerpt:
      '4 riesgos comunes al aceptar empleo en el extranjero sin asesoramiento profesional: legales, laborales, contractuales y culturales, con información verídica.',
    category: 'Empleo en el extranjero',
    date: '2026-02-13',
    readingMinutes: 6,
    hero: 'from-destructive-soft to-warning-soft',
    body: [
      { type: 'p', text: 'Las redes sociales están llenas de "ofertas de empleo internacional" que prometen sueldos altos y trámites express. La realidad: aceptar una oferta sin asesoramiento profesional puede costarte muy caro.' },
      { type: 'h2', text: 'Riesgo 1: Situación irregular' },
      { type: 'p', text: 'Sin contrato de origen firmado y visado tramitado en tu país, llegas a España como turista. Trabajar en esa situación es ilegal y puede acabar en expulsión y prohibición de entrada futura. Además te bloquea el acceso a vías legales posteriores.' },
      { type: 'h2', text: 'Riesgo 2: Explotación laboral' },
      { type: 'p', text: 'Sin contrato registrado, no tienes salario garantizado, ni horario, ni vacaciones, ni protección frente a despido. Hay casos documentados de personas que han trabajado meses sin cobrar, alojadas en condiciones precarias por sus "empleadores".' },
      { type: 'h2', text: 'Riesgo 3: Estafas económicas' },
      { type: 'p', text: 'Es común que falsas agencias pidan pagos por adelantado por "gestión de visado", "curso obligatorio" o "alojamiento" que nunca se materializan. Una vez pagas, la persona desaparece. Las cantidades pueden superar los 3.000€.' },
      { type: 'h2', text: 'Riesgo 4: Desadaptación cultural sin red' },
      { type: 'p', text: 'Llegar solo a un país nuevo, sin trabajo formal, sin alojamiento estable, sin red de apoyo, en un momento de presión económica, lleva con frecuencia a problemas de salud mental y a tener que volver al país en peores condiciones de las que se salió.' },
      { type: 'callout', title: '¿Cómo evitarlo?', text: 'Verifica siempre que la empresa contratante existe (CIF, dirección, web). Pide ver la resolución de extranjería antes de pagar nada. Si una oferta parece demasiado buena, probablemente lo es. Ante la duda, consulta con organismos oficiales o con MIGRIA.' },
    ],
  },
  {
    slug: 'contratacion-en-origen-hacia-espana',
    title: 'Contratación en origen hacia España: las 3 estafas más comunes que debes evitar',
    excerpt:
      'Evita fraudes en tu camino a España. Las 3 estafas más comunes al buscar contratación en origen desde Perú y cómo identificar ofertas legales y seguras.',
    category: 'Movilidad laboral',
    date: '2026-02-13',
    readingMinutes: 6,
    hero: 'from-destructive-soft to-warning-soft',
    body: [
      { type: 'p', text: 'La demanda de empleo en España y la esperanza legítima de muchas familias latinoamericanas atrae también a estafadores. Estas son las 3 estafas más comunes y cómo identificarlas.' },
      { type: 'h2', text: 'Estafa 1: La "agencia" que cobra por adelantado' },
      { type: 'p', text: 'Te contactan ofreciendo gestionarte el visado de trabajo a cambio de un pago inicial de entre 1.000€ y 5.000€. Garantizan que en 3 semanas estás en España. Una vez pagas, dejan de responder o piden más dinero por "imprevistos".' },
      { type: 'h3', text: 'Cómo detectarla' },
      { type: 'ul', items: [
        'Piden pago antes de mostrar contrato firmado.',
        'No tienen sede física verificable.',
        'Prometen tiempos imposibles (3 semanas vs los 3-6 meses reales).',
        'No quieren videollamada o solo se comunican por WhatsApp.',
      ]},
      { type: 'h2', text: 'Estafa 2: La empresa que no existe' },
      { type: 'p', text: 'Te ofrecen un puesto en una "empresa de hostelería en Madrid". Cuando investigas, no tiene CIF activo, ni dirección verificable, ni presencia online real. El supuesto "contrato" es un PDF con membrete falso.' },
      { type: 'h3', text: 'Cómo verificar una empresa' },
      { type: 'ul', items: [
        'Busca el CIF en la web del Registro Mercantil.',
        'Comprueba que la dirección existe en Google Maps Street View.',
        'Llama a la centralita de la empresa con el número que aparece en su web oficial.',
        'Pide referencias de otros trabajadores extranjeros que ya hayan pasado por allí.',
      ]},
      { type: 'h2', text: 'Estafa 3: El contrato envenenado' },
      { type: 'p', text: 'La empresa existe, el visado es real, pero el contrato esconde cláusulas abusivas: descuento de "gastos de viaje" del salario durante un año, alojamiento obligatorio caro, prohibición de cambiar de empresa, etc. Te encuentras atrapado en condiciones casi de servidumbre.' },
      { type: 'callout', title: 'Lo que hace MIGRIA', text: 'En MIGRIA todos los contratos cumplen el convenio colectivo del sector, sin cláusulas abusivas. Trabajamos solo con empresas verificadas, con varios años de actividad y referencias contrastadas. Y el coste de la tramitación legal lo asume la empresa contratante.' },
    ],
  },
  {
    slug: 'empleo-en-espana-sectores-con-mayor-demanda',
    title: 'Empleo en España: sectores con mayor demanda en 2026',
    excerpt:
      'Sectores con mayor demanda de empleo en España en 2026: tecnología, sanidad, turismo, logística, energías renovables y educación.',
    category: 'Sector',
    date: '2026-02-13',
    readingMinutes: 7,
    hero: 'from-info-soft to-success-soft',
    body: [
      { type: 'p', text: 'España vive una situación paradójica: alto desempleo en algunos perfiles y, al mismo tiempo, miles de vacantes sin cubrir en sectores clave. Estos son los más demandantes de talento internacional en 2026.' },
      { type: 'h2', text: '1. Hostelería y turismo' },
      { type: 'p', text: 'El gran motor de la economía española sufre escasez crónica. Más del 60% de los restaurantes y hoteles afirman tener dificultades para cubrir vacantes de cocina, sala y housekeeping. Perfiles más buscados: cocineros, ayudantes, jefes de partida, camareros, baristas, sommeliers, gobernantas y recepcionistas.' },
      { type: 'h2', text: '2. Sanidad y cuidados' },
      { type: 'p', text: 'Envejecimiento de la población y déficit estructural de personal. Se demandan médicos, enfermeros (con título homologado), auxiliares de enfermería, técnicos en cuidados auxiliares y cuidadores de personas mayores y dependientes.' },
      { type: 'h2', text: '3. Tecnología' },
      { type: 'p', text: 'Desarrolladores, ingenieros DevOps, científicos de datos, expertos en ciberseguridad. Salarios competitivos y muchas opciones de teletrabajo. La Tarjeta Azul UE facilita el acceso para perfiles altamente cualificados.' },
      { type: 'h2', text: '4. Logística y transporte' },
      { type: 'p', text: 'Conductores de camión con CAP, mozos de almacén, operarios de paquetería, gestores de cadena de suministro. El boom del e-commerce y la posición geográfica de España como puerta de entrada a Europa han disparado la demanda.' },
      { type: 'h2', text: '5. Construcción y obra civil' },
      { type: 'p', text: 'Albañiles, encofradores, ferrallistas, instaladores de placas solares. Las ayudas europeas para vivienda y eficiencia energética han disparado la demanda.' },
      { type: 'h2', text: '6. Energías renovables' },
      { type: 'p', text: 'Instaladores fotovoltaicos, técnicos de mantenimiento de parques eólicos, ingenieros de proyectos. Sector en pleno crecimiento por las metas de transición energética 2030.' },
      { type: 'h2', text: '7. Agricultura y agroindustria' },
      { type: 'p', text: 'Operarios agrícolas estacionales y permanentes, técnicos de invernadero, manipuladores en industria alimentaria, pescaderos y carniceros con experiencia.' },
    ],
  },
  {
    slug: 'contratacion-en-origen-en-peru',
    title: '5 cosas que debes saber sobre la contratación en origen si estás en Perú',
    excerpt:
      '¿Quieres trabajar en España legalmente? Descubre qué es la contratación en origen, los requisitos para peruanos y el rol del consulado en Lima.',
    category: 'Contratación en origen',
    date: '2026-02-13',
    readingMinutes: 6,
    hero: 'from-success-soft to-primary-soft',
    body: [
      { type: 'p', text: 'La contratación en origen es la vía legal más segura para trabajar en España siendo peruano. Estas son las 5 cosas clave que debes saber antes de iniciar el proceso.' },
      { type: 'h2', text: '1. Qué es exactamente' },
      { type: 'p', text: 'La contratación en origen es el procedimiento por el que una empresa española solicita autorización para contratar a un trabajador que reside fuera de la Unión Europea. Toda la tramitación se hace antes de que viajes: visado, alta en Seguridad Social y contrato. Llegas a España con todo en regla.' },
      { type: 'h2', text: '2. La oferta debe estar en el catálogo' },
      { type: 'p', text: 'La empresa española solo puede contratarte por esta vía si la ocupación está incluida en el "Catálogo de Ocupaciones de Difícil Cobertura" del Servicio Público de Empleo Estatal, o si justifica la necesidad mediante un certificado de búsqueda infructuosa de candidatos en España.' },
      { type: 'h2', text: '3. El proceso tiene 4 fases' },
      { type: 'ol', items: [
        'Selección y entrevistas por videollamada.',
        'Firma de preacuerdo con la empresa.',
        'Tramitación de la autorización ante extranjería en España.',
        'Solicitud de visado en el Consulado de España en Lima.',
      ]},
      { type: 'h2', text: '4. Qué documentos necesitas en Perú' },
      { type: 'ul', items: [
        'DNI vigente.',
        'Pasaporte con al menos 6 meses de vigencia.',
        'Antecedentes penales del Ministerio de Justicia, legalizados.',
        'Certificado médico.',
        'Título profesional legalizado (si aplica).',
        'Contrato de trabajo firmado por la empresa española.',
      ]},
      { type: 'h2', text: '5. El rol del Consulado General de España en Lima' },
      { type: 'p', text: 'Una vez tu empresa ha tramitado y obtenido la autorización en España, recibes una notificación. Con esa resolución y el resto de documentación, pides cita en el Consulado de España en Lima para tu visado de trabajo. La cita puede demorar entre 1 y 3 meses según carga.' },
      { type: 'callout', title: 'Migria como puente', text: 'Trabajamos con consultoras legales en Perú y España. Te acompañamos en cada paso, evitando errores documentales y garantizando que llegas con todo listo.' },
    ],
  },
  {
    slug: 'oferta-de-empleo-para-extranjeros-8-errores',
    title: 'Oferta de empleo para extranjeros: 8 errores que te hacen perder oportunidades',
    excerpt:
      'Evita los 8 errores más comunes al buscar oferta de empleo para extranjeros: ofertas poco fiables, CV genérico, mala estrategia y falta de preparación.',
    category: 'Empleo en el extranjero',
    date: '2026-02-13',
    readingMinutes: 7,
    hero: 'from-warning-soft to-primary-soft',
    body: [
      { type: 'p', text: 'No basta con buscar "trabajo en España" en Google. Estos son los 8 errores que cometen la mayoría de candidatos internacionales y que les hacen perder oportunidades reales.' },
      { type: 'h2', text: 'Error 1: CV genérico para todo' },
      { type: 'p', text: 'Mismo CV para Argentina, España y Estados Unidos. El CV español tiene su formato (1-2 páginas, foto opcional, cronología inversa, sin información personal sensible). Adáptalo si quieres que lo lean.' },
      { type: 'h2', text: 'Error 2: Aplicar a ofertas que no encajan' },
      { type: 'p', text: 'Aplicar a 100 ofertas al día sin leerlas no funciona. Es mejor aplicar a 10 ofertas perfectamente alineadas con tu perfil con un mensaje personalizado para cada empresa.' },
      { type: 'h2', text: 'Error 3: No verificar la oferta' },
      { type: 'p', text: 'Hay miles de ofertas falsas. Antes de invertir tiempo o dinero, verifica que la empresa existe, que tiene CIF activo y que la persona que te contacta usa email corporativo, no Gmail.' },
      { type: 'h2', text: 'Error 4: No prepararse para la entrevista' },
      { type: 'p', text: 'En España las entrevistas son más informales que en otros países latinoamericanos pero no menos exigentes. Prepara la empresa: qué hace, cuántos empleados tiene, dónde opera. Prepara preguntas inteligentes que muestren interés real.' },
      { type: 'h2', text: 'Error 5: Pedir cosas inadecuadas en la primera entrevista' },
      { type: 'p', text: 'Preguntar por sueldo y vacaciones en la primera frase es señal de mal candidato. Demuestra primero interés en el rol y en la empresa. El sueldo se discute cuando hay match.' },
      { type: 'h2', text: 'Error 6: Mentir en el CV' },
      { type: 'p', text: 'Las empresas verifican títulos y experiencia. Mentir en un dato verificable significa rechazo automático y entrar en lista negra de la empresa.' },
      { type: 'h2', text: 'Error 7: No invertir en la documentación' },
      { type: 'p', text: 'Tener antecedentes penales legalizados, título universitario apostillado y certificados de cursos antes de iniciar entrevistas acelera el proceso enormemente. Las empresas valoran candidatos "listos para empezar".' },
      { type: 'h2', text: 'Error 8: Buscar solo' },
      { type: 'p', text: 'El mercado laboral español tiene sus códigos. Tener un partner como MIGRIA que conoce ambos lados (la oferta española y el perfil latinoamericano) multiplica las probabilidades de éxito y reduce los riesgos.' },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): Article[] {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, count);
}
