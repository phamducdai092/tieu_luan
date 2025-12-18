import type {UserBrief} from "@/types/user.type.ts";
import type {MemberRole} from "@/types/enum/group.enum.ts";

export type MemberResponsePageParams = {
    page?: number;
    size?: number;
    sort?: string;
    role?: MemberRole;
}

export type MemberResponse = {
    member: UserBrief;
    role: MemberRole;
}