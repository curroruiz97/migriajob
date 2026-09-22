import { notFound } from 'next/navigation';
import { TrendingDown, Users, CheckCircle2, XCircle, RefreshCw, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getMetricas } from '@/lib/db/metricas';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Métricas' };
export const dynamic = 'force-dynamic';

/**
 * Métricas del proceso migratorio. Solo para el equipo.
 *
 * La pregunta que contesta la pantalla, por orden: cuántos procesos acaban
 * bien, en qué paso se sale la gente y por qué. El embudo es lo primero
 * porque es lo que se pidió: de las once etapas, dónde se pierde a la gente.
 *
 * /admin lo comparten empresas y equipo, así que el filtro por rol se hace
 * aquí y no basta con el middleware.
 */
export default async function MetricasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: string }>();
  if (perfil?.role !== 'admin') notFound();

  const m = await getMetricas();
  const maxAlcanzaron = Math.max(1, ...m.embudo.map((f) => f.alcanzaron));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Métricas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cómo acaban los procesos y en qué paso se sale la gente.
        </p>
      </div>

      {/* Cifras de cabecera */}
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        <Cifra icon={Users} etiqueta="En curso" valor={m.en_curso} />
        <Cifra icon={CheckCircle2} etiqueta="Incorporados" valor={m.incorporados} tono="exito" />
        <Cifra icon={XCircle} etiqueta="Cerrados sin incorporar" valor={m.cerrados} tono="aviso" />
        <Cifra
          icon={TrendingDown}
          etiqueta="Tasa de éxito"
          valor={m.tasa_exito === null ? '—' : `${m.tasa_exito}%`}
          pie={m.tasa_exito === null ? 'aún no ha terminado ninguno' : 'de los procesos terminados'}
        />
        <Cifra icon={RefreshCw} etiqueta="Reposiciones" valor={m.reposiciones} />
      </div>

      {m.dias_hasta_incorporacion !== null && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          De media, <strong className="text-foreground">{m.dias_hasta_incorporacion} días</strong>{' '}
          desde que se abre el expediente hasta que la persona se incorpora.
        </p>
      )}

      {/* Embudo */}
      <section>
        <h2 className="text-base font-semibold">Dónde se sale la gente</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuántos expedientes llegaron a cada etapa y cuántos no pasaron de ahí.
        </p>

        {m.total === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title="Todavía no hay expedientes"
            description="En cuanto se abra el primero, aquí aparecerá el recorrido completo."
            className="mt-6"
          />
        ) : (
          <div className="mt-5 space-y-2">
            {m.embudo.map((f, i) => (
              <div key={f.key} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-sm font-medium">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}</span>
                    {f.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">{f.alcanzaron}</strong> llegaron
                    {f.aqui_ahora > 0 && <> · {f.aqui_ahora} aquí ahora</>}
                    {f.se_cayeron_aqui > 0 && (
                      <>
                        {' '}
                        · <span className="text-destructive">{f.se_cayeron_aqui} se cayeron</span>
                      </>
                    )}
                    {f.dias_medios !== null && <> · {f.dias_medios} días de media</>}
                  </p>
                </div>

                {/* Barra: lo que llegó, y dentro lo que se perdió aquí. */}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(f.alcanzaron / maxAlcanzaron) * 100}%` }}
                  >
                    {f.se_cayeron_aqui > 0 && (
                      <div
                        className="h-full bg-destructive"
                        style={{
                          width: `${(f.se_cayeron_aqui / Math.max(1, f.alcanzaron)) * 100}%`,
                          marginLeft: 'auto',
                        }}
                      />
                    )}
                  </div>
                </div>

                {f.tasa_caida > 0 && (
                  <p className="mt-1.5 text-xs text-destructive">
                    Se pierde aquí el {f.tasa_caida}% de los que llegan
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Motivos */}
      <section>
        <h2 className="text-base font-semibold">Por qué no llegaron</h2>
        {m.motivos.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Todavía no se ha cerrado ningún expediente. El motivo se elige al cerrarlo, desde la
            ficha del expediente.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {m.motivos.map((mo) => (
                  <tr key={mo.motivo} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{mo.etiqueta}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">{mo.total}</td>
                    <td className="w-24 px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {mo.porcentaje}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="rounded-lg border border-border bg-surface-muted px-4 py-3 text-xs text-muted-foreground">
        Estas cifras salen de lo que el equipo registra en los expedientes. Si un proceso termina y
        nadie lo cierra desde su ficha, aquí seguirá contando como en curso: el panel refleja lo
        que se apunta, no lo que pasa.
      </p>
    </div>
  );
}

function Cifra({
  icon: Icon,
  etiqueta,
  valor,
  pie,
  tono,
}: {
  icon: typeof Users;
  etiqueta: string;
  valor: number | string;
  pie?: string;
  tono?: 'exito' | 'aviso';
}) {
  const color =
    tono === 'exito' ? 'text-success' : tono === 'aviso' ? 'text-destructive' : 'text-primary';
  return (
    <div className="bg-surface p-4">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        {etiqueta}
      </p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight">{valor}</p>
      {pie && <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{pie}</p>}
    </div>
  );
}
