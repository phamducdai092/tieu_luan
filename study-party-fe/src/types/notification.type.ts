import type {UserBrief} from "@/types/user.type.ts";

export type NotificationResponse = {
    id: number;
    content: string;
    link: string;
    type: string;
    visRead: boolean;
    createdAt: string;
    recipient: UserBrief;
}