import { describe, expect, test } from 'bun:test';
import { slugify, generateJobSlug } from '@/lib/utils/slugify';
import { JOURNEY_STAGES, getStageIndex, getStageProgress } from '@/lib/journey-stages';
import { signUpSchema, signInSchema } from '@/lib/validations/auth';

/**
 * Pruebas de la lógica que no depende de la base de datos ni del navegador.
 *
 * Se ejecutan con `bun test`, sin dependencias añadidas y sin credenciales, y
 * corren en cada cambio dentro del CI. No cubren los flujos de producto —eso
 * necesita una base de datos de pruebas, que no existe todavía— pero sí lo que
 * más silenciosamente puede romperse: generación de direcciones, etapas del
 * proceso migratorio y validación de formularios.
 */

describe('slugify', () => {
  test('pasa a minúsculas y une con guiones', () => {
    expect(slugify('Jefe de Cocina')).toBe('jefe-de-cocina');
  });

  test('no deja guiones sueltos al principio ni al final', () => {
    expect(slugify('  Cocinero  ')).toBe('cocinero');
    expect(slugify('--Office--')).toBe('office');
  });

  test('colapsa los guiones repetidos', () => {
    expect(slugify('Ayudante   de    cocina')).toBe('ayudante-de-cocina');
  });

  test('aguanta null, undefined y cadena vacía sin romper', () => {
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
    expect(slugify('')).toBe('');
  });

  test('nunca deja espacios, que romperían la dirección', () => {
    const casos = ['Jefe/a de partida', 'Mozo & almacén', 'Técnico (nivel 2)'];
    for (const c of casos) {
      expect(slugify(c)).not.toContain(' ');
    }
  });
});

describe('generateJobSlug', () => {
  test('junta puesto y empresa', () => {
    expect(generateJobSlug('Cocinero', 'Hotel Sur')).toBe('cocinero-at-hotel-sur');
  });

  test('si falta uno de los dos, usa el que haya', () => {
    expect(generateJobSlug('Cocinero', null)).toBe('cocinero');
    expect(generateJobSlug(null, 'Hotel Sur')).toBe('hotel-sur');
  });

  test('sin datos devuelve algo utilizable, no una cadena vacía', () => {
    // Una dirección vacía colgaría de la raíz del sitio.
    expect(generateJobSlug(null, null)).toBe('job');
  });
});

describe('etapas del proceso migratorio', () => {
  test('son once y empiezan en seleccionado y acaban en bienvenido', () => {
    expect(JOURNEY_STAGES).toHaveLength(11);
    expect(JOURNEY_STAGES[0].key).toBe('seleccionado');
    expect(JOURNEY_STAGES.at(-1)?.key).toBe('bienvenido');
  });

  test('no hay dos etapas con la misma clave', () => {
    const claves = JOURNEY_STAGES.map((e) => e.key);
    expect(new Set(claves).size).toBe(claves.length);
  });

  test('el índice respeta el orden del proceso', () => {
    expect(getStageIndex('seleccionado')).toBe(0);
    expect(getStageIndex('expediente_presentado')).toBeGreaterThan(
      getStageIndex('inicio_proceso')
    );
    expect(getStageIndex('bienvenido')).toBe(10);
  });

  test('una clave desconocida no revienta', () => {
    expect(getStageIndex('no-existe')).toBe(-1);
  });

  test('el progreso va de 0 a 100 y nunca se sale', () => {
    for (const etapa of JOURNEY_STAGES) {
      const p = getStageProgress(etapa.key);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    }
    expect(getStageProgress('bienvenido')).toBe(100);
  });
});

describe('validación de alta de cuenta', () => {
  const valido = {
    email: 'persona@ejemplo.com',
    password: 'unaContraseñaLarga',
    fullName: 'Ana Pérez',
    role: 'candidate',
  };

  test('acepta un alta correcta', () => {
    expect(signUpSchema.safeParse(valido).success).toBe(true);
  });

  test('rechaza un correo que no lo es', () => {
    expect(signUpSchema.safeParse({ ...valido, email: 'no-es-un-correo' }).success).toBe(false);
  });

  test('rechaza contraseñas cortas', () => {
    expect(signUpSchema.safeParse({ ...valido, password: '123' }).success).toBe(false);
  });

  test('rechaza un rol inventado', () => {
    expect(signUpSchema.safeParse({ ...valido, role: 'administrador' }).success).toBe(false);
  });

  test('el inicio de sesión exige correo y contraseña', () => {
    expect(signInSchema.safeParse({ email: '', password: '' }).success).toBe(false);
  });
});
