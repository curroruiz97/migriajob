'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ImagePlus, ExternalLink, Upload } from 'lucide-react';
import { uploadAvatarAction, uploadCvAction } from '@/app/dashboard/storage-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type State = { ok?: true; error?: string } | null;

export function CvUpload({ currentUrl }: { currentUrl: string | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<State, FormData>(uploadCvAction, null);

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <FileText className="h-4 w-4 text-muted-foreground" />
        Currículum (PDF)
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">Máximo 5 MB. Se actualiza con un enlace privado de 30 días.</p>

      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Ver CV actual <ExternalLink className="h-3 w-3" />
        </a>
      )}

      <form
        ref={formRef}
        action={action}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          type="file"
          name="cv"
          accept="application/pdf"
          required
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-surface-muted file:px-3 file:py-1.5 file:text-foreground file:hover:bg-muted"
        />
        <Button type="submit" size="sm" disabled={pending}>
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          {pending ? 'Subiendo…' : 'Subir CV'}
        </Button>
      </form>

      {state?.ok && (
        <p className="mt-2 text-xs text-success">CV subido correctamente.</p>
      )}
      {state?.error && (
        <p className="mt-2 text-xs text-destructive">{state.error}</p>
      )}
    </div>
  );
}

export function AvatarUpload({
  currentUrl,
  initials,
  label = 'Foto de perfil',
  uploadAction = uploadAvatarAction,
}: {
  currentUrl: string | null;
  initials: string;
  label?: string;
  uploadAction?: (prev: State, fd: FormData) => Promise<State>;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<State, FormData>(uploadAction, null);
  // Previsualización instantánea del archivo elegido (PASO 2).
  const [preview, setPreview] = useState<string | null>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  // Al confirmar el servidor: soltar el blob local y refrescar la ruta para que
  // el avatar del topbar (en el layout) se actualice al instante (Bug 4).
  useEffect(() => {
    if (state?.ok) {
      setPreview(null);
      router.refresh();
    }
  }, [state, router]);

  // Limpia el objeto URL para no fugar memoria.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shown = preview ?? currentUrl;

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <ImagePlus className="h-4 w-4 text-muted-foreground" />
        {label}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">PNG, JPG o WebP. Máx 2 MB.</p>

      <div className="mt-4 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {shown && <AvatarImage src={shown} alt="" />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="file"
            name="avatar"
            accept="image/png,image/jpeg,image/webp"
            required
            onChange={onPick}
            className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-surface-muted file:px-3 file:py-1.5 file:text-foreground file:hover:bg-muted"
          />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Subiendo…' : 'Cambiar'}
          </Button>
        </form>
      </div>

      {state?.ok && <p className="mt-2 text-xs text-success">Foto actualizada.</p>}
      {state?.error && <p className="mt-2 text-xs text-destructive">{state.error}</p>}
    </div>
  );
}
