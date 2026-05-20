'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, Check } from 'lucide-react';
import { deleteTemplateAction } from './actions';
import { Button } from '@/components/ui/button';

export function TemplateRow({ id, name, body }: { id: string; name: string; body: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const remove = () => {
    if (!confirm(`¿Eliminar la plantilla "${name}"?`)) return;
    startTransition(async () => {
      await deleteTemplateAction(id);
      router.refresh();
    });
  };

  return (
    <li className="card-hover rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={copy} title="Copiar al portapapeles" aria-label="Copiar">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={remove}
            disabled={pending}
            title="Eliminar"
            aria-label="Eliminar"
            className="text-destructive hover:bg-destructive-soft"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-surface-muted/40 p-3 text-xs text-muted-foreground">
        {body}
      </pre>
    </li>
  );
}
