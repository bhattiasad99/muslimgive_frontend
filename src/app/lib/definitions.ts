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


// Use NEXT_PUBLIC_SERVER for client-side access in Next.js; fall back to SERVER if available.
export const serverUrl = process.env.NEXT_PUBLIC_SERVER || process.env.SERVER || ''

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin?: boolean;
    isActive?: boolean;
    isVerified?: boolean;
    dob?: string;
    dateOfBirth?: string;
    country?: string;
    countryName?: string;
    city?: string;
    postalCode?: string;
    roles: string[];
    permissions?: string[];
    status: string;
    requestingPasswordReset: boolean;
}

export type ChangePasswordPayload = {
    password: string;
    oldPassword: string;
}
