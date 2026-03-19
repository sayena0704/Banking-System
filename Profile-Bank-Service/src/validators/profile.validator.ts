import { z } from "zod";


export const createProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters"),


  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters"),


  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),


  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format (expected ISO string)",
    })
    .optional(),


  addressLine1: z.string().min(5).optional(),
  addressLine2: z.string().min(5).optional(),
});


export type CreateProfileInput = z.infer<typeof createProfileSchema>;




export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  addressLine1: z.string().min(5).optional(),
  addressLine2: z.string().min(5).optional(),
});


export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;



