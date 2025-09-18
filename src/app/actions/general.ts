'use server'
import { redirect } from "next/navigation";
import { ResponseType } from "../lib/definitions";
import { _get } from "../lib/methods";

export const getMe = async (): Promise<ResponseType> => {
    const profileRes = await _get('');
    return profileRes;
}