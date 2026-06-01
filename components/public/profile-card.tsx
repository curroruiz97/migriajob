import Link from 'next/link';
import { MapPin, Briefcase, Sparkles } from 'lucide-react';
import type { Database } from '@/lib/supabase/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { CompareToggle } from '@/components/admin/compare-toggle';
import { CountryFlag, countryName } from '@/components/ui/country-flag';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { WorkPermitBadge, NieBadge } from '@/components/ui/documentation-badges';
import { cn } from '@/lib/utils';

type Candidate = Database['public']['Tables']['candidates']['Row'];

const AVAILABILITY_LABELS: Record<string, string> = {
  open: 'Disponible',
  passive: 'Abierto a oportunidades',
  closed: 'No disponible',
};

const AVAILABILITY_STYLES: Record<string, string> = {
  open: 'bg-success-soft text-success',
  passive: 'bg-warning-soft text-warning',
  closed: 'bg-muted text-muted-foreground',
};

interface ProfileCardProps {
  profile: Candidate;
  view?: 'grid' | 'list';
  highlighted?: boolean;
  /** Prefijo de ruta para el enlace. Default: '/perfiles' */
  hrefPrefix?: string;
}

function getInitials(profile: Candidate): string {
  const text = profile.full_name ?? profile.headline ?? profile.current_role ?? 'M';
  return text
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ProfileCard({ profile, view = 'grid', highlighted, hrefPrefix = '/perfiles' }: ProfileCardProps) {
  const skills = (profile.skills ?? []).slice(0, 5);
  const initials = getInitials(profile);
  const location = [profile.location_city, profile.location_country].filter(Boolean).join(', ');
  const href = profile.slug ? `${hrefPrefix}/${profile.slug}` : '#';

  if (view === 'list') {
    return (
      <Link
        href={href}
        className={cn(
          'card-hover flex items-start gap-3 overflow-hidden rounded-xl border border-border bg-surface p-3 sm:gap-4 sm:p-4',
          highlighted && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background sm:h-14 sm:w-14">
          {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
          <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              {profile.full_name && (
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-semibold text-foreground">
                    {profile.full_name}
                  </h3>
                  {profile.verified && <VerifiedBadge size="sm" />}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                {!profile.full_name && profile.verified && <VerifiedBadge size="sm" />}
                <p className={cn(
                  'truncate',
                  profile.full_name
                    ? 'text-sm text-muted-foreground'
                    : 'font-semibold text-foreground'
                )}>
                  {profile.headline ?? profile.current_role ?? 'Profesional'}
                </p>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {profile.country_of_origin && (
                  <span className="flex items-center gap-1">
                    <CountryFlag code={profile.country_of_origin} size="sm" />
                    {countryName(profile.country_of_origin)}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </span>
                )}
                {profile.years_experience != null && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {profile.years_experience} {profile.years_experience === 1 ? 'año' : 'años'}
                  </span>
                )}
              </div>
            </div>
            <Badge className={cn('shrink-0', AVAILABILITY_STYLES[profile.availability])}>
              {AVAILABILITY_LABELS[profile.availability]}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap gap-1 sm:gap-1.5">
            <WorkPermitBadge status={profile.work_permit as never} />
            <NieBadge has={profile.has_nie ?? false} />
            {skills.slice(0, 3).map((s) => (
              <Badge key={s} variant="outline" className="max-w-[120px] truncate text-xs font-normal">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  // GRID view
  return (
    <Link
      href={href}
      className={cn(
        'card-hover group flex flex-col rounded-xl border border-border bg-surface p-5',
        highlighted && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="relative">
          <Avatar className="h-12 w-12 ring-2 ring-background">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
            <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
          </Avatar>
          {profile.country_of_origin && (
            <span className="absolute -bottom-1 -right-1 text-base">
              <CountryFlag code={profile.country_of_origin} size="md" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CompareToggle
            candidateId={profile.id}
            candidateName={profile.headline ?? profile.current_role ?? 'Candidato'}
            candidateSlug={profile.slug}
          />
          <Badge className={AVAILABILITY_STYLES[profile.availability]}>
            {AVAILABILITY_LABELS[profile.availability]}
          </Badge>
        </div>
      </div>

      {profile.full_name && (
        <div className="mt-4 flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground line-clamp-1">
            {profile.full_name}
          </h3>
          {profile.verified && <VerifiedBadge size="sm" />}
        </div>
      )}
      <div className={cn('flex items-center gap-1.5', profile.full_name ? 'mt-0.5' : 'mt-4')}>
        {!profile.full_name && profile.verified && <VerifiedBadge size="sm" />}
        <p className={cn(
          'line-clamp-1',
          profile.full_name
            ? 'text-sm text-muted-foreground'
            : 'text-base font-semibold text-foreground'
        )}>
          {profile.headline ?? profile.current_role ?? 'Profesional'}
        </p>
      </div>
      {!profile.full_name && profile.current_role && profile.headline && (
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{profile.current_role}</p>
      )}

      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        {location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{location}</span>
          </div>
        )}
        {profile.years_experience != null && (
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            {profile.years_experience} {profile.years_experience === 1 ? 'año' : 'años'} de experiencia
          </div>
        )}
        {profile.desired_salary_min != null && (
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Desde {profile.desired_salary_min.toLocaleString('es-ES')} €
            {profile.desired_salary_max ? ` – ${profile.desired_salary_max.toLocaleString('es-ES')} €` : ''}
          </div>
        )}
      </div>

      {/* Documentación: lo que vende a un empresario español */}
      <div className="mt-3 flex flex-wrap gap-1">
        <WorkPermitBadge status={profile.work_permit as never} />
        <NieBadge has={profile.has_nie ?? false} />
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <Badge key={s} variant="outline" className="text-xs font-normal">
              {s}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}

export function ProfileCardPlaceholder() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-4 space-y-1.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  );
}
