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
        .trim(),
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
