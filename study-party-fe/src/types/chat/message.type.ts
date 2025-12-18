import type {MemberRole} from "../enum/group.enum";
import type {UserBrief} from "@/types/user.type.ts";

export const MessageTypeEnum = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    FILE: "FILE",
    SYSTEM: "SYSTEM",
    REPLY: "REPLY"
} as const;

export interface IMessage {
    messageId: number;
    sender: UserBrief;
    senderRole: MemberRole;
    targetId: number;
    content: string;
    type: MessageType;
    createdAt: string;
    isGroup: boolean;
}

export type MessageType = typeof MessageTypeEnum[keyof typeof MessageTypeEnum];
