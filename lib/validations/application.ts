import { z } from 'zod';

export const applicationStatusEnum = z.enum([
  'submitted',
  'reviewing',
  'shortlisted',
  'rejected',
  'hired',
]);

export const applicationInsertSchema = z.object({
  jobId: z.string().uuid(),
  candidateId: z.string().uuid(),
  coverLetter: z.string().max(5000).optional().nullable(),
  cvUrl: z.string().url().optional().nullable(),
});

export const applicationStatusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: applicationStatusEnum,
  notes: z.string().max(2000).optional().nullable(),
});

export type ApplicationInsert = z.infer<typeof applicationInsertSchema>;
export type ApplicationStatusUpdate = z.infer<typeof applicationStatusUpdateSchema>;
