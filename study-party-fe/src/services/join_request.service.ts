import http from "@/lib/http.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {JoinRequestForUser, JoinRequestResponse} from "@/types/group/join_request.type.ts";

const prefix = 'request/';

export const createJoinRequest = async (slug: string) => {
    const res = await http.post<ApiResponse<void>>(`${prefix}/${slug}`);
    return res.data;
}

export const cancelJoinRequest = async (slug: string) => {
    const res = await http.delete<ApiResponse<void>>(`${prefix}/${slug}`);
    return res.data;
}

export const approveJoinRequest = async (requestId: number) => {
    const res = await http.post<ApiResponse<void>>(`${prefix}/${requestId}/approve`);
    return res.data;
}

export const rejectJoinRequest = async (requestId: number) => {
    const res = await http.post<ApiResponse<void>>(`${prefix}/${requestId}/reject`);
    return res.data;
}

export const getJoinRequestsForGroup = async (slug: string) => {
    const res = await http.get<JoinRequestResponse[]>(`${prefix}/group/${slug}`);
    return res as unknown as UnwrappedResponse<JoinRequestResponse[]>;
}

export const getJoinRequestsByUser = async (
    params?: {
        page?: number;
        size?: number;
    }
) => {
    const res = await http.get<JoinRequestForUser[]>(`${prefix}/user`, {params});
    return res as unknown as UnwrappedResponse<JoinRequestForUser[]>;
}
