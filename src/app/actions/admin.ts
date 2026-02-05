import { Data } from "@/components/use-case/UsersExpandableTable";
import { ResponseType } from "../lib/definitions";
import { _get, _post } from "@/auth";


export const getUsers = async (): Promise<ResponseType<Data[]>> => {
    const profileRes = await _get('admin/users');
    return profileRes;
}

/**
 * POST /admin/mg-member/resend-invite
 * Resend invitation email to a user
 */
export const resendInviteAction = async (email: string): Promise<ResponseType> => {
    return await _post('/admin/mg-member/resend-invite', { email });
}