'use server'
import { ResponseType } from "../lib/definitions";
import { _get } from "../lib/methods";

export const baseEndPoint = async (): Promise<ResponseType> => {
    const profileRes = await _get('');
    return profileRes;
}