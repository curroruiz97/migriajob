import { z } from 'zod';

export const companyInsertSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  name: z.string().min(2).max(120),
  description: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  industry: z.string().optional().nullable(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  location: z.string().optional().nullable(),
});

export type CompanyInsert = z.infer<typeof companyInsertSchema>;
