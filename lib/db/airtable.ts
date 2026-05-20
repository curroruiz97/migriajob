/**
 * @deprecated — Migrado a Drizzle/Supabase. Este archivo se conserva como
 * stub vacío para que cualquier import legacy no rompa el build durante la
 * transición. Eliminar tras confirmar que ningún componente vivo lo usa.
 */

import type { CurrencyCode } from '@/lib/constants/currencies';

export type SalaryUnit = 'hour' | 'day' | 'week' | 'month' | 'year' | 'project';

export type Salary = {
  min: number | null;
  max: number | null;
  currency: CurrencyCode;
  unit: SalaryUnit;
};

export type CareerLevel =
  | 'Internship'
  | 'EntryLevel'
  | 'Associate'
  | 'Junior'
  | 'MidLevel'
  | 'Senior'
  | 'Staff'
  | 'Principal'
  | 'Lead'
  | 'Manager'
  | 'SeniorManager'
  | 'Director'
  | 'SeniorDirector'
  | 'VP'
  | 'SVP'
  | 'EVP'
  | 'CLevel'
  | 'Founder'
  | 'NotSpecified';

export type Job = {
  id: string;
  title: string;
  company: string;
  type: string;
  salary: Salary | null;
  description: string;
  benefits: string | null;
  application_requirements: string | null;
  apply_url: string;
  posted_date: string;
  valid_through?: string | null;
  status: 'active' | 'inactive';
  career_level: CareerLevel[];
  visa_sponsorship: 'Yes' | 'No' | 'Not specified';
  featured: boolean;
  workplace_type: string;
  workplace_city: string | null;
  workplace_country: string | null;
  languages: string[];
};

export function formatSalary(): string {
  return 'Not specified';
}
export function formatUSDApproximation(): string | null {
  return null;
}
export function normalizeAnnualSalary(): number {
  return -1;
}
