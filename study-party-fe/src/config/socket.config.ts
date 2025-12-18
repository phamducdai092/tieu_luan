import type { RoomDetail } from "@/types/group/group.type";
import type { NotificationResponse } from "@/types/notification.type";
import type {IMessage} from "@/types/chat/message.type.ts";

// 1. Định nghĩa Tên Sự Kiện (Event Names)
// Dùng 'as const' để TS hiểu đây là các giá trị cố định (Literal Types)
export const SOCKET_EVENTS = {
    ROOM_UPDATED: "ROOM_UPDATED",
    NEW_NOTIFICATION: "NEW_NOTIFICATION",
    JOIN_REQUEST_APPROVED: "REQUEST_APPROVED",
    JOIN_REQUEST_REJECTED: "REQUEST_REJECTED",
    MEMBER_ROLE_CHANGE: "MEMBER_ROLE_CHANGE",
    NEW_GROUP_MESSAGE: "NEW_GROUP_MESSAGE",
} as const;

// 2. Định nghĩa Công thức tạo Topic (Topic Generators)
// Giúp m không bao giờ phải gõ chuỗi "/topic/..." thủ công nữa
export const SOCKET_TOPICS = {
    room: (slug: string) => `/topic/room/${slug}`,
    userNotifications: (userId: number | string) => `/topic/user/${userId}/notifications`,
    // Sau này có chat:
    chatRoom: (roomId: number) => `/topic/chat/${roomId}`,
};

// 3. Định nghĩa Type cho từng loại Message (Discriminated Unions)
// Đây là phần "ma thuật" giúp VS Code gợi ý code cực mạnh

export type RoomUpdatedMessage = {
    type: typeof SOCKET_EVENTS.ROOM_UPDATED;
    payload: RoomDetail;
};

export type NewNotificationMessage = {
    type: typeof SOCKET_EVENTS.NEW_NOTIFICATION;
    payload: NotificationResponse;
};

export type NewGroupMessage = {
    type: typeof SOCKET_EVENTS.NEW_GROUP_MESSAGE;
    payload: IMessage;
}

// Tổng hợp lại thành một type chung
export type SocketMessage =
    | RoomUpdatedMessage
    | NewNotificationMessage
    | NewGroupMessage;