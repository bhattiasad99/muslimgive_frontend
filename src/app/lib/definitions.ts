import { z } from 'zod';


export const SignInFormSchema = z.object({
    email: z.string("Email is required").email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string("Password is required")
        .trim(),
})

export type ResponseType<K = any> = {
    ok: boolean;
    unauthenticated: boolean;
    payload: K;
    message?: string
}

export type FormState =
    | {
        errors?: {
            email?: string[]
            password?: string[]
        }
        message?: string
    }
    | undefined

export const serverUrl = process.env.SERVER!

export const AUTH_COOKIE_LABEL = 'Authentication';
export const REFRESH_COOKIE_LABEL = 'Refresh'