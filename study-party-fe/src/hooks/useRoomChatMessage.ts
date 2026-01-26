import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type IMessage } from "@/types/chat/message.type.ts";
import type { SendMessageRequest } from "@/types/chat/chat.request.ts";
import { sendGroupMessage } from "@/services/chat.service.ts";
import { SOCKET_EVENTS, SOCKET_TOPICS, type SocketMessage } from "@/config/socket.config.ts";
import {useGlobalSocket} from "@/context/GlobalSocketContext.tsx";

export function useRoomChatMessage(roomId: number) {
    const { client, isConnected } = useGlobalSocket();
    const [groupMessages, setGroupMessages] = useState<IMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (roomId: number, messageRequest: SendMessageRequest, files?: File[]) => {
        try {
            await sendGroupMessage(roomId, messageRequest, files);
        } catch (err: any) {
            console.error(err);
            const errMsg = err?.response?.data?.message || "Không thể gửi tin nhắn.";
            setError(errMsg);
            toast.error(errMsg);
            throw err;
        }
    }, []);

    // Logic Subscribe Topic Chat
    useEffect(() => {
        // 👇 FIX 1: Thêm check client.connected
        if (!client || !isConnected || !roomId || !client.connected) return;

        console.log(`👂 [Chat] Subscribing to topic: /topic/chat/${roomId}`);

        let subscription: any = null;

        try {
            // 👇 FIX 2: Bọc try-catch
            subscription = client.subscribe(SOCKET_TOPICS.chatRoom(roomId), (message) => {
                try {
                    const msgBody = JSON.parse(message.body) as SocketMessage;
                    if (msgBody.type === SOCKET_EVENTS.NEW_GROUP_MESSAGE) {
                        const payload = msgBody.payload;
                        setGroupMessages(prev => {
                            const isExist = prev.some(m => (m.messageId && m.messageId === payload.messageId));
                            if (isExist) return prev;
                            return [...prev, payload];
                        });
                    }
                } catch (e) {
                    console.error("Socket parse error:", e);
                }
            });
        } catch (error) {
            console.error("Chat subscription failed:", error);
        }

        return () => {
            if (subscription) {
                try {
                    console.log(`🔕 [Chat] Unsubscribing topic...`);
                    subscription.unsubscribe();
                } catch (e) {}
            }
        };

    }, [client, isConnected, roomId]);

    return {
        groupMessages,
        error,
        sendMessage,
    };
}