'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  title?: string;
  text?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  label?: string;
}

/**
 * Botón "Compartir" funcional. Usa Web Share API en móvil; en desktop copia al portapapeles.
 */
export function ShareButton({
  title,
  text,
  className,
  variant = 'outline',
  size = 'sm',
  label = 'Compartir',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const data = { title: title ?? document.title, text: text ?? '', url };

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // Usuario canceló o navegador no admite — caemos al fallback
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin clipboard, último recurso: prompt
      window.prompt('Copia este enlace:', url);
    }
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleShare}>
      {copied ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5 text-success" />
          Enlace copiado
        </>
      ) : (
        <>
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  );
}
