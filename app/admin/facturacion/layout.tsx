import type { ReactNode } from 'react';
import { soloEquipo } from '@/lib/auth/solo-equipo';

export default async function Layout({ children }: { children: ReactNode }) {
  await soloEquipo();
  return children;
}
