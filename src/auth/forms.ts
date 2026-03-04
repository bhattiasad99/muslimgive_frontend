import { z } from 'zod';

export const SignInFormSchema = z.object({
    email: z.string("Email is required").email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string("Password is required")
        .trim(),
})

export const SetPasswordFormSchema = z.object({
    password: z
        .string("Password is required")
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (e.g. @, !, #, $)'),
    confirmPassword: z
        .string("Confirm Password is required")
        .trim(),
})

export type LoginFormState =
    | {
        errors?: {
            email?: string[]
            password?: string[]
        }
        message?: string
    }
    | undefined

export type SetPasswordFormState =
    | {
        errors?: {
            password?: string[]
            confirmPassword?: string[]
        }
        message?: string
    }
    | undefined
