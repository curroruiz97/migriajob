import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, 'Mínimo 2 caracteres').max(120),
  role: z.enum(['candidate', 'employer']).default('candidate'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
