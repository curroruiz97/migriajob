import { ProfileCardPlaceholder } from '@/components/public/profile-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="bg-white dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50/40 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-3 h-4 w-96" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProfileCardPlaceholder key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
