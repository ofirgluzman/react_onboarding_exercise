import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  email: z.string().email(),
  phone: z.string(),
  image: z.string().url(),
  university: z.string(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  bloodGroup: z.string().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  eyeColor: z.string().optional(),
  address: z.object({
    city: z.string(),
    state: z.string(),
    stateCode: z.string(),
    country: z.string().optional(),
  }),
  company: z.object({
    department: z.string(),
    name: z.string(),
    title: z.string(),
  }),
});

export const usersArraySchema = z.array(userSchema);

// Infer the TypeScript type from the schema
export type UserFromSchema = z.infer<typeof userSchema>;
