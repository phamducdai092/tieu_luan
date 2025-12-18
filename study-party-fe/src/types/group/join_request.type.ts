import type {UserBrief} from "@/types/user.type.ts";
import type {Room} from "@/types/group/group.type.ts";

export type CreteJoinRequestPayload = {
    groupSlug: string;
}

export type JoinRequestResponse = {
    requestId: number;
    groupId: number;
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";
    createdAt: string;
    resolver: UserBrief;
    user: UserBrief;
    owner: UserBrief;
}

export type JoinRequestForUser = {
    joinRequestResponse: JoinRequestResponse;
    groupResponse: Room;
}