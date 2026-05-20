import Link from 'next/link';
import { ArrowRight, Search, Filter, MessageSquare, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Cómo funciona',
  description: 'Descubre cómo Migria conecta empresas con talento cualificado en cuatro sencillos pasos.',
};

const STEPS = [
  {
    icon: Search,
    title: 'Busca por skills, ubicación o experiencia',
    description:
      'Más de 50 filtros, búsqueda full-text en español, autocompletado y filtros persistentes en la URL para compartir o guardar.',
  },
  {
    icon: Filter,
    title: 'Filtra por disponibilidad real',
    description:
      'Cada perfil declara si está disponible, abierto a oportunidades o no busca activamente. Filtra por lo que necesitas hoy.',
  },
  {
    icon: MessageSquare,
    title: 'Contacta y gestiona el proceso',
    description:
      'Envía mensajes, añade notas privadas y mueve candidatos por las etapas del kanban: Nuevo → Contactado → Entrevista → Oferta → Contratado.',
  },
  {
    icon: Trophy,
    title: 'Contrata mejor y más rápido',
    description:
      'Métricas en tiempo real, exportación a CSV y un comparador para tomar decisiones informadas en equipo.',
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Cómo funciona Migria
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
            En cuatro pasos pasas de "necesito contratar" a "tengo a la persona adecuada".
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="flex gap-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Paso {idx + 1}
                </span>
                <h3 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-zinc-900 px-8 py-14 text-center text-white dark:bg-zinc-100 dark:text-zinc-900">
          <h2 className="text-3xl font-bold tracking-tight">¿Lo probamos?</h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-300 dark:text-zinc-700">
            14 días gratis del plan Pro. Sin tarjeta de crédito.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white">
              <Link href="/registro">
                Empezar prueba gratis <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 dark:border-zinc-900/20 dark:bg-zinc-900/10 dark:text-zinc-900 dark:hover:bg-zinc-900/20">
              <Link href="/perfiles">Ver perfiles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
