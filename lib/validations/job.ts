import { z } from 'zod';

export const jobTypeEnum = z.enum([
  'full_time',
  'part_time',
  'contract',
  'internship',
  'freelance',
]);

export const workModeEnum = z.enum(['on_site', 'hybrid', 'remote']);

export const experienceLevelEnum = z.enum(['entry', 'junior', 'mid', 'senior', 'lead']);

export const jobStatusEnum = z.enum([
  'draft',
  'published',
  'paused',
  'expired',
  'archived',
]);

export const jobInsertSchema = z
  .object({
    companyId: z.string().uuid(),
    slug: z
      .string()
      .min(3)
      .max(120)
      .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
    title: z.string().min(3).max(200),
    description: z.string().min(20),
    requirements: z.string().optional().nullable(),
    benefits: z.string().optional().nullable(),
    jobType: jobTypeEnum,
    workMode: workModeEnum,
    experienceLevel: experienceLevelEnum.optional().nullable(),
    location: z.string().optional().nullable(),
    salaryMin: z.number().int().positive().optional().nullable(),
    salaryMax: z.number().int().positive().optional().nullable(),
    currency: z.string().length(3).default('EUR'),
    skills: z.array(z.string()).optional(),
    status: jobStatusEnum.default('draft'),
    featured: z.boolean().optional(),
    expiresAt: z.coerce.date().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.salaryMin && data.salaryMax) {
        return data.salaryMin <= data.salaryMax;
      }
      return true;
    },
    { message: 'salaryMin debe ser menor o igual que salaryMax', path: ['salaryMax'] }
  );

export type JobInsert = z.infer<typeof jobInsertSchema>;

export const jobFiltersSchema = z.object({
  q: z.string().optional(),
  workMode: workModeEnum.optional(),
  jobType: jobTypeEnum.optional(),
  experienceLevel: experienceLevelEnum.optional(),
  location: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type JobFilters = z.infer<typeof jobFiltersSchema>;
