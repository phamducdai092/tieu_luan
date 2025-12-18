import http from "@/lib/http.ts";
import type {SendMessageRequest} from "@/types/chat/chat.request";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {IMessage} from "@/types/chat/message.type.ts";

export const sendGroupMessage = async (groupId: number, chatRequestPayload: SendMessageRequest) => {
    const res = await http.post<ApiResponse<void>>(`/chat/group/${groupId}`, {
        content: chatRequestPayload.content,
        type: chatRequestPayload.type
    });
    return res.data;
}

export const getGroupMessages = async (groupId: number) => {

    const res = await http.get<IMessage[]>(`/chat/group/${groupId}`, {
        params: {
            page: 0,
            size: 20,
        }
    });

    return res as UnwrappedResponse<IMessage[]>;
}