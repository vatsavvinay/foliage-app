import { z } from 'zod';

/**
 * Validation schemas for authentication inputs
 */

export const EmailSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()
  .max(255, 'Email too long');

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[!@#$%^&*]/, 'Password must contain special character (!@#$%^&*)');

export const NameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

export const SignUpSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  passwordConfirm: z.string(),
}).refine(
  (data) => data.password === data.passwordConfirm,
  {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  }
);

export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password required'),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;

/**
 * Validate input against schema and return structured errors
 */
export function validateInput<T>(
  schema: z.ZodSchema,
  data: unknown
): { valid: boolean; data?: T; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data);
    return { valid: true, data: validated as T, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return {
      valid: false,
      errors: { _form: 'Validation failed' },
    };
  }
}
