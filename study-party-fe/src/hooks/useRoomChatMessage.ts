import {useCallback, useEffect, useState} from "react";
import {toast} from "sonner";
import type {IMessage} from "@/types/chat/message.type.ts";
import type {SendMessageRequest} from "@/types/chat/chat.request.ts";
import {sendGroupMessage} from "@/services/chat.service.ts";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import {SOCKET_EVENTS, SOCKET_TOPICS, type SocketMessage} from "@/config/socket.config.ts";


export function useRoomChatMessage(roomId: number, token: string) {
    const [groupMessages, setGroupMessages] = useState<IMessage[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (roomId: number, messageRequest: SendMessageRequest) => {
        try {
            await sendGroupMessage(roomId, messageRequest);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Không thể gửi tin nhắn.");
            toast.error("Không thể gửi tin nhắn.");
        }

    }, [roomId, token]);

    useEffect(() => {
        setGroupMessages([]); // Reset messages when roomId changes
        setError(null);

        const socket = new SockJS(import.meta.env.VITE_API_URL + "/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("💬 Connected to Room Chat:", roomId);

                // Subscribe to group chat topic
                stompClient.subscribe(SOCKET_TOPICS.chatRoom(roomId), (message) => {
                    const msgBody = JSON.parse(message.body) as SocketMessage;

                    if (msgBody.type === SOCKET_EVENTS.NEW_GROUP_MESSAGE) {
                        setGroupMessages(prevMessages => [...prevMessages, msgBody.payload]);
                        toast.success("Tin nhắn mới vừa đến!");
                    }
                });
            },
            onStompError: (frame) => {
                console.error("Lỗi STOMP: " + frame.headers["message"]);
            },
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
                console.log("🔌 WebSocket Disconnected");
            }
        };

    }, [roomId, token]);

    return {
        groupMessages,
        isLoadingMore,
        error,
        sendMessage,
    }
}