import {useEffect, useState, useMemo} from "react";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {toast} from "sonner";
import {getRoomDetailBySlug} from "@/services/group.service";
import {SOCKET_EVENTS, SOCKET_TOPICS, type SocketMessage} from "@/config/socket.config";
import type {RoomDetail} from "@/types/group/group.type";
import {MemberRoleEnum} from "@/types/enum/group.enum";

export function useRoomRealtime(slug?: string) {
    const [roomData, setRoomData] = useState<RoomDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch ban đầu
    useEffect(() => {
        if (!slug) {
            setError("Không tìm thấy mã phòng.");
            setIsLoading(false);
            return;
        }
        const fetchRoomDetails = async () => {
            try {
                setIsLoading(true);
                const response = await getRoomDetailBySlug(slug);
                setRoomData(response);
                setError(null);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Không thể tải thông tin phòng.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoomDetails();
    }, [slug]);

    // WebSocket
    useEffect(() => {
        if (!slug) return;

        const socket = new SockJS(import.meta.env.VITE_API_URL + "/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("🔌 WebSocket Connected!");
                stompClient.subscribe(SOCKET_TOPICS.room(slug), (message) => {
                    const msgBody = JSON.parse(message.body) as SocketMessage;
                    if (msgBody.type === SOCKET_EVENTS.ROOM_UPDATED) {
                        console.log("🔔 Update:", msgBody.payload);
                        setRoomData((prev) => {
                            if (!prev) return null;
                            return {...prev, ...msgBody.payload};
                        });
                        toast.info("Thông tin phòng vừa được cập nhật!");
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
    }, [slug]);

    // Derived State (Role logic)
    const role = roomData?.currentUserRole ?? null;
    const isGuest = useMemo(() => !role || role === "GUEST", [role]);
    const isOwner = role === MemberRoleEnum.OWNER;
    const isMod = role === MemberRoleEnum.MOD;

    const reloadRoomData = async () => {
        if (slug) {
            const res = await getRoomDetailBySlug(slug);
            setRoomData(res);
        }
    }

    return {roomData, isLoading, error, isGuest, isOwner, isMod, role, reloadRoomData};
}