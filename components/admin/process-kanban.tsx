'use client';

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { GripVertical, MapPin } from 'lucide-react';
import { updateProcessStageAction } from '@/app/admin/procesos/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CountryFlag } from '@/components/ui/country-flag';
import { cn } from '@/lib/utils';

type Stage = 'new' | 'contacted' | 'interview' | 'offer' | 'hired' | 'rejected';

interface ProcessItem {
  id: string;
  candidateId: string;
  candidateSlug: string | null;
  candidateAvatarUrl: string | null;
  candidateHeadline: string;
  candidateCountry?: string | null;
  candidateLocation: string;
  stage: Stage;
  notes: string | null;
  updatedAt: Date;
}

const COLUMNS: { id: Stage; label: string; tone: string }[] = [
  { id: 'new', label: 'Nuevo', tone: 'bg-muted' },
  { id: 'contacted', label: 'Contactado', tone: 'bg-info-soft' },
  { id: 'interview', label: 'Entrevista', tone: 'bg-primary-soft' },
  { id: 'offer', label: 'Oferta', tone: 'bg-warning-soft' },
  { id: 'hired', label: 'Contratado', tone: 'bg-success-soft' },
  { id: 'rejected', label: 'Descartado', tone: 'bg-destructive-soft' },
];

export function ProcessKanban({ items: initial }: { items: ProcessItem[] }) {
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStage = over.id as Stage;
    const itemId = active.id as string;
    const item = items.find((i) => i.id === itemId);
    if (!item || item.stage === newStage) return;

    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, stage: newStage } : i)));
    startTransition(() => updateProcessStageAction(itemId, newStage));
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {COLUMNS.map((col) => {
          const colItems = items.filter((i) => i.stage === col.id);
          return (
            <KanbanColumn key={col.id} column={col} count={colItems.length}>
              {colItems.map((item) => (
                <KanbanCard key={item.id} item={item} />
              ))}
              {colItems.length === 0 && (
                <p className="rounded-md border border-dashed border-zinc-300 px-3 py-4 text-center text-xs text-zinc-400 dark:border-zinc-700">
                  Suelta un candidato aquí
                </p>
              )}
            </KanbanColumn>
          );
        })}
      </div>
    </DndContext>
  );
}

function KanbanColumn({
  column,
  count,
  children,
}: {
  column: (typeof COLUMNS)[number];
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-border p-3 transition-colors',
        column.tone,
        isOver && 'ring-2 ring-primary'
      )}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{column.label}</h3>
        <Badge variant="outline" className="bg-white text-xs dark:bg-zinc-950">
          {count}
        </Badge>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function KanbanCard({ item }: { item: ProcessItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  const initials = item.candidateHeadline
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition-shadow dark:border-zinc-800 dark:bg-zinc-900',
        isDragging && 'rotate-1 opacity-50'
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab pt-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          aria-label="Mover"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="relative">
          <Avatar className="h-8 w-8">
            {item.candidateAvatarUrl && <AvatarImage src={item.candidateAvatarUrl} alt="" />}
            <AvatarFallback className="bg-primary-soft text-primary text-xs">{initials}</AvatarFallback>
          </Avatar>
          {item.candidateCountry && (
            <span className="absolute -bottom-1 -right-1 text-xs">
              <CountryFlag code={item.candidateCountry} size="xs" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={item.candidateSlug ? `/perfiles/${item.candidateSlug}` : '#'}
            className="block truncate text-sm font-medium text-foreground hover:text-primary hover:underline"
          >
            {item.candidateHeadline}
          </Link>
          {item.candidateLocation && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {item.candidateLocation}
            </p>
          )}
        </div>
      </div>
      {item.notes && (
        <p className="mt-2 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">{item.notes}</p>
      )}
    </div>
  );
}
