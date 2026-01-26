import http from "@/lib/http.ts";
import type {SendMessageRequest} from "@/types/chat/chat.request";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {IMessage} from "@/types/chat/message.type.ts";

// Helper đóng gói FormData chuẩn cho Spring Boot (@RequestPart)
const buildFormData = (jsonData: any, files?: File[]) => {
    const formData = new FormData();
    // Ép kiểu JSON thành Blob application/json
    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
    formData.append("data", jsonBlob);

    // Append files nếu có
    if (files && files.length > 0) {
        files.forEach((file) => formData.append("files", file));
    }
    return formData;
};

export const sendGroupMessage = async (groupId: number, chatRequestPayload: SendMessageRequest, files?: File[]) => {
    // Dùng buildFormData để đóng gói
    const formData = buildFormData(chatRequestPayload, files);

    // Gửi POST với FormData (Browser tự set Content-Type multipart/form-data)
    const res = await http.post<ApiResponse<void>>(
        `/chat/group/${groupId}`,
        formData
    );
    return res.data;
}

export const getGroupMessages = async (groupId: number, page: number = 0, size: number = 20) => {
    const res = await http.get<IMessage[]>(`/chat/group/${groupId}`, {
        params: {page, size}
    });

    return res as UnwrappedResponse<IMessage[]>;
}