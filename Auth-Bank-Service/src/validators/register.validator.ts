



import { z } from 'zod';


export const registerSchema = z.object({
    email: z.string().email({
    message: "Invalid email format",
  }),


  password: z.string()
  .min(8, { message: 'Password must be at least 8 characters'})
  .max(64, { message: 'Password too long'})
  .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
  .regex(/[0-9]/, {
      message: "Password must contain at least one digit",
    })
  .regex(/[*#@$!%&]/, {
      message:
        "Password must contain at least one special character (* # @ $ ! % &)",
    }),

  role: z.enum(["USER", "ADMIN"]).optional(),
  adminSecret: z.string().optional(),

});
