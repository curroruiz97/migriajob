import { MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { TemplateForm } from './template-form';
import { TemplateRow } from './template-row';

export const metadata = { title: 'Plantillas de mensaje' };

const SUGGESTIONS = [
  {
    name: 'Primera toma de contacto',
    body: `Hola {nombre},

Vi tu perfil en Migria y me ha encantado tu experiencia en {rol}. Estamos buscando una persona para nuestro equipo en {ciudad} y creo que podrías encajar muy bien.

¿Te interesaría que tengamos una primera videollamada de 15 minutos esta semana para conocernos?

Un saludo,
{firma}`,
  },
  {
    name: 'Citación a entrevista',
    body: `Hola {nombre},

Tras nuestra primera conversación, me gustaría avanzar al siguiente paso: una entrevista técnica con nuestro equipo.

Te propongo estos huecos:
- {opcion_1}
- {opcion_2}
- {opcion_3}

¿Cuál te viene mejor?

Saludos,
{firma}`,
  },
  {
    name: 'Oferta económica',
    body: `Hola {nombre},

Tras evaluar tu perfil queremos hacerte una oferta formal:

· Puesto: {puesto}
· Salario bruto anual: {salario} €
· Modalidad: {modalidad}
· Inicio: {fecha_inicio}

Adjunto contrato preliminar. Cualquier duda, me dices.

Un abrazo,
{firma}`,
  },
  {
    name: 'Descarte cordial',
    body: `Hola {nombre},

Gracias por el tiempo y el interés que has puesto en este proceso. En esta ocasión hemos optado por otro perfil que encaja mejor con las necesidades específicas del equipo.

Tu candidatura nos ha gustado y la guardamos para futuras oportunidades.

Mucha suerte y un fuerte abrazo,
{firma}`,
  },
];

export default async function PlantillasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: templates } = await supabase
    .from('message_templates')
    .select('*')
    .eq('employer_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Plantillas de mensaje</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea respuestas reutilizables y úsalas con un click en cualquier conversación.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Lista */}
        <div>
          {!templates || templates.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No tienes plantillas todavía"
              description="Crea tu primera plantilla a la derecha. O usa una de las sugerencias para empezar rápido."
            />
          ) : (
            <ul className="space-y-3">
              {templates.map((t) => (
                <TemplateRow key={t.id} id={t.id} name={t.name} body={t.body} />
              ))}
            </ul>
          )}

          {/* Sugerencias */}
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-muted/40 p-6">
            <h2 className="text-sm font-semibold text-foreground">Sugerencias</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              4 plantillas recomendadas para empezar. Pulsa una y se rellena el formulario.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <details key={s.name} className="group rounded-lg border border-border bg-surface p-3 text-sm">
                  <summary className="cursor-pointer font-medium text-foreground">{s.name}</summary>
                  <pre className="mt-2 max-h-32 overflow-y-auto rounded-md bg-surface-muted p-2 text-xs whitespace-pre-wrap text-muted-foreground">
                    {s.body}
                  </pre>
                  <Badge variant="soft" className="mt-2 text-[10px]">Copia y pega arriba</Badge>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Crear nueva */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TemplateForm />
        </aside>
      </div>
    </div>
  );
}
