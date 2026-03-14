

	import {z} from 'zod';


export const verifyOtpSchema = z.object({
    email: z.string().email({
        message: 'Invalid email format',
    }),
    otp: z.string()
    .length(6, { message: 'OTP must be exactly 6 digits'}),
});





