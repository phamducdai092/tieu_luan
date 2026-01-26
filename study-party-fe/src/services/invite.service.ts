import http from "@/lib/http";
import type { ApiResponse, UnwrappedResponse } from "@/types/api.type.ts";
import type { InvitationRequest, InvitationResponse } from "@/types/group/invitation.type.ts";
import type {RequestStatus} from "@/types/enum/request.status,type.ts";

export const inviteService = {
    // ================= GROUP OWNER ACTIONS =================

    // 1. Create Invitation (Gửi lời mời)
    // POST /groups/{slug}/invitations
    createInvitation: async (slug: string, request: InvitationRequest) => {
        const res = await http.post<ApiResponse<void>>(`/groups/${slug}/invitations`, request);
        return res.data;
    },

    // 2. Get Group Invitations (Danh sách lời mời của nhóm - Có phân trang & filter)
    // GET /groups/{slug}/invitations
    getGroupInvitations: async (
        slug: string,
        params?: {
            page?: number;
            size?: number;
            sort?: string;
            status?: RequestStatus
            keyword?: string;
        }
    ) => {
        const res = await http.get<InvitationResponse[]>(`/groups/${slug}/invitations`, {
            params: {
                page: params?.page || 0,
                size: params?.size || 10,
                sort: params?.sort || 'createdAt',
                status: params?.status,
                keyword: params?.keyword
            }
        });
        return res as UnwrappedResponse<InvitationResponse[]>;
    },

    // 3. Revoke Invitation (Thu hồi lời mời)
    // DELETE /groups/{slug}/invitations/{invitationId}
    revokeInvitation: async (slug: string, invitationId: number) => {
        const res = await http.delete<ApiResponse<void>>(`/groups/${slug}/invitations/${invitationId}`);
        return res.data;
    },

    // ================= USER ACTIONS =================

    // 4. Get User Invitations (Danh sách lời mời gửi tới User - Có phân trang & filter)
    // GET /invites
    getUserInvitations: async (
        params?: {
            page?: number;
            size?: number;
            sort?: string;
            status?: RequestStatus
            keyword?: string;
        }
    ) => {
        const res = await http.get<InvitationResponse[]>("/invites", {
            params: {
                page: params?.page || 0,
                size: params?.size || 10,
                sort: params?.sort || 'createdAt',
                status: params?.status,
                keyword: params?.keyword
            }
        });
        return res as UnwrappedResponse<InvitationResponse[]>;
    },

    // 5. Accept Invitation (Chấp nhận)
    // POST /invites/{token}/accept
    acceptInvite: async (token: string) => {
        const res = await http.post<ApiResponse<void>>(`/invites/${token}/accept`);
        return res.data;
    },

    // 6. Decline Invitation (Từ chối)
    // POST /invites/{token}/decline
    declineInvite: async (token: string) => {
        const res = await http.post<ApiResponse<void>>(`/invites/${token}/decline`);
        return res.data;
    }
};