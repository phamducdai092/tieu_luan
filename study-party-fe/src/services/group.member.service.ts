import http from "@/lib/http.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {MemberResponse, MemberResponsePageParams} from "@/types/group/member.type.ts";
import type {MemberRole} from "@/types/enum/group.enum.ts";


export const getGroupMembers = async (groupId: number, memberResponsePageParams?: MemberResponsePageParams) => {
    const res = await http.get<MemberResponse[]>(`/groups/members/${groupId}`, {
        params: {
            page: memberResponsePageParams?.page || 0,    // Mặc định là 0
            size: memberResponsePageParams?.size || 12,   // Mặc định là 12
            sort: memberResponsePageParams?.sort,
            role: memberResponsePageParams?.role
        }
    });
    return res as UnwrappedResponse<MemberResponse[]>;
}

export const leaveGroup = async (groupId: number) => {
    const res = await http.delete<ApiResponse<void>>(`/groups/members/${groupId}/leave`);
    return res.data;
}

export const kickGroupMember = async (groupId: number, memberId: number) => {
    const res = await http.delete<ApiResponse<void>>(`/groups/members/${groupId}/kick/${memberId}`);
    return res.data;
}

export const setMemberRole = async (groupId: number, memberId: number, newMemberRole: MemberRole) => {
    const res = await http.put<ApiResponse<void>>(`/groups/members/${groupId}/role/${memberId}`, {newMemberRole});
    return res.data;
}

export const transferGroupOwnership = async (groupId: number, newOwnerId: number) => {
    const res = await http.put<ApiResponse<void>>(`/groups/members/${groupId}/transfer-ownership/${newOwnerId}`);
    return res.data;
}
