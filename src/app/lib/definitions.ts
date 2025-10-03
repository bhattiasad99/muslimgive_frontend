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
    payload: ApiResponse<K> | null;
    message?: string
}

export type ApiResponse<T> = {
    appName: string;
    path: string;
    statusCode: number;
    data: T;
    apiVersion: string;
    message: string;
    error: string | null;
    userId: string | null;
};


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
export const IS_ADMIN_COOKIE_LABEL = 'IsAdmin'

export const AUTH_ROUTES = ["/charities", "/my-profile", "/users", "/access-control"];
export const ADMIN_ROUTES = ["/users", "/access-control"];