import http from "@/lib/http.ts";
import type {ApiResponse} from "@/types/api.type.ts";
import type {VideoCallResponse} from "@/types/chat/message.type.ts";

export const callService = async (groupId: number) => {
    const res = await http.post<ApiResponse<VideoCallResponse>>(`chat/group/${groupId}/call`);
    return res.data;
}