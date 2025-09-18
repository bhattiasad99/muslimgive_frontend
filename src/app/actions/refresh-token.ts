'use server'

import { cookies } from "next/headers"

export const refreshToken = async () => {
    const _cookies = cookies();
}