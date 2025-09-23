import { Data } from "@/components/use-case/UsersExpandableTable";
import { ResponseType } from "../lib/definitions";
import { _get } from "../lib/methods";


export const getUsers = async (): Promise<ResponseType<Data[]>> => {
    const profileRes = await _get('admin/users');
    return profileRes;
}