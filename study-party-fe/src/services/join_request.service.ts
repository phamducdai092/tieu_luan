import http from "@/lib/http.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {JoinRequestForUser, JoinRequestResponse} from "@/types/group/join_request.type.ts";

export const createJoinRequest = async (slug: string) => {
    const res = await http.post<ApiResponse<void>>(`request/${slug}`);
    return res.data;
}

export const cancelJoinRequest = async (slug: string) => {
    const res = await http.delete<ApiResponse<void>>(`request/${slug}`);
    return res.data;
}

export const approveJoinRequest = async (requestId: number) => {
    const res = await http.post<ApiResponse<void>>(`request/${requestId}/approve`);
    return res.data;
}

export const rejectJoinRequest = async (requestId: number) => {
    const res = await http.post<ApiResponse<void>>(`request/${requestId}/reject`);
    return res.data;
}

export const getJoinRequestsForGroup = async (slug: string) => {
    const res = await http.get<ApiResponse<JoinRequestResponse[]>>(`request/group/${slug}`);
    return res as unknown as UnwrappedResponse<JoinRequestResponse[]>;
}

export const getJoinRequestsByUser = async () => {
    const res = await http.get<ApiResponse<JoinRequestForUser[]>>(`request/user`);
    return res as unknown as UnwrappedResponse<JoinRequestForUser[]>;
}
