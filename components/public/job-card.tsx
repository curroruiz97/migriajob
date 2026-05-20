import Link from 'next/link';
import { ArrowUpRight, Briefcase, Clock, MapPin } from 'lucide-react';
import type { JobOffer } from '@/lib/content/jobs';
import { Badge } from '@/components/ui/badge';
import { CountryFlag } from '@/components/ui/country-flag';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: JobOffer;
  view?: 'grid' | 'list';
  featured?: boolean;
}

export function JobCard({ job, view = 'grid', featured }: JobCardProps) {
  const Icon = job.icon;

  if (view === 'list') {
    return (
      <Link
        href={`/empleos/${job.slug}`}
        className={cn(
          'card-hover group relative flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6',
          featured && 'ring-2 ring-primary/30 ring-offset-2'
        )}
      >
        <div className="relative shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-soft to-primary-soft/40 text-primary ring-1 ring-primary/15 transition-transform group-hover:scale-[1.03]">
            <Icon className="h-7 w-7" />
          </div>
          <span className="absolute -bottom-1 -right-1 rounded-full bg-surface p-0.5 shadow-sm ring-1 ring-border">
            <CountryFlag code={job.countryCode} size="sm" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                {job.title}
              </h3>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                {job.category}
              </p>
            </div>
            <Badge variant="soft" className="shrink-0 gap-1">
              <CountryFlag code={job.countryCode} size="sm" />
              {job.countryName}
            </Badge>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {job.shortDescription}
          </p>

          <MetaRow job={job} />
        </div>

        <ArrowUpRight className="hidden h-4 w-4 shrink-0 self-center text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:block" />
      </Link>
    );
  }

  // GRID view — mirrors ProfileCard layout
  return (
    <Link
      href={`/empleos/${job.slug}`}
      className={cn(
        'card-hover group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-5',
        featured && 'ring-2 ring-primary/30 ring-offset-2'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft to-primary-soft/40 text-primary ring-1 ring-primary/15 transition-transform group-hover:scale-[1.03]">
            <Icon className="h-6 w-6" />
          </div>
          <span className="absolute -bottom-1 -right-1 rounded-full bg-surface p-0.5 shadow-sm ring-1 ring-border">
            <CountryFlag code={job.countryCode} size="sm" />
          </span>
        </div>
        <Badge variant="soft" className="shrink-0 gap-1 text-[10px]">
          {job.countryName}
        </Badge>
      </div>

      <div className="mt-4">
        <h3 className="flex items-center gap-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          <span className="line-clamp-1">{job.title}</span>
          <ArrowUpRight
            aria-hidden
            className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </h3>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {job.category}
        </p>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {job.shortDescription}
      </p>

      <div className="mt-auto pt-4">
        <MetaRow job={job} />
      </div>
    </Link>
  );
}

function MetaRow({ job }: { job: JobOffer }) {
  return (
    <div className="flex flex-wrap gap-1.5 text-[11px]">
      <Chip>
        <Clock className="h-3 w-3" />
        {job.type}
      </Chip>
      <Chip>
        <Briefcase className="h-3 w-3" />
        {job.mode}
      </Chip>
      {job.city && (
        <Chip>
          <MapPin className="h-3 w-3" />
          <span className="truncate max-w-[120px]">{job.city}</span>
        </Chip>
      )}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2 py-0.5 text-muted-foreground">
      {children}
    </span>
  );
}

export function JobCardPlaceholder({ view = 'grid' }: { view?: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-1/5" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1 h-3 w-4/5" />
      <div className="mt-auto flex gap-1.5 pt-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}
