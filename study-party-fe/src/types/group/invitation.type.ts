import type {UserBrief} from "@/types/user.type.ts";
import type {RequestStatus} from "@/types/enum/request.status,type.ts";

export type CreateInvitationPayload = {
    groupSlug: string;
    email: string;
    userId: number;
}

export type InvitationRequest = {
    email: string;
}

export type InvitationResponse = {
    id: number;
    token: string;
    groupId: number;
    groupName: string;
    groupSlug: string;
    inviter: UserBrief;
    invitee: UserBrief;
    status: RequestStatus;
    createdAt: string;
    expiresAt: string;
}