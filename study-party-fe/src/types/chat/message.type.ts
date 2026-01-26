import type {MemberRole} from "../enum/group.enum";
import type {UserBrief} from "@/types/user.type.ts";
import type {AttachmentResponse} from "@/types/attachment/attachment.type.ts";

export const MessageTypeEnum = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    FILE: "FILE",
    VIDEO_CALL: "VIDEO_CALL",
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
    attachments?: AttachmentResponse[];
}

export type VideoCallResponse = {
    token : string;
    channelName: string;
    appId: string;
}

export type MessageType = typeof MessageTypeEnum[keyof typeof MessageTypeEnum];
