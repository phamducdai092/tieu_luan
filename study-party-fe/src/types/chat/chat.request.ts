import type {MessageType} from "@/types/chat/message.type.ts";

export type SendMessageRequest = {
    content: string;
    type: MessageType;
}