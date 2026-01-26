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

        // CẤU HÌNH LẠI CLIENT
        const stompClient = new Client({
            // 1. Dùng Relative URL để ăn theo Proxy của Vite (fix lỗi CORS và Port)
            // 2. Nhét new SockJS vào trong hàm arrow function => Đây là Lazy Initialization
            webSocketFactory: () => new SockJS("/api/ws"),

            // Tắt debug nếu thấy rác console quá, hoặc để log cũng được
            debug: (str) => console.log(str),

            // Thời gian chờ kết nối lại (ms)
            reconnectDelay: 5000,

            // Thời gian gửi heartbeat để giữ kết nối không bị đứt (quan trọng)
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

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
            // Thêm cái này để debug lỗi đóng kết nối
            onWebSocketClose: () => {
                console.log("WebSocket đã đóng.");
            }
        });

        // Kích hoạt
        stompClient.activate();

        // CLEANUP FUNCTION - CỰC KỲ QUAN TRỌNG
        return () => {
            // Hủy kết nối ngay lập tức khi component unmount hoặc slug đổi
            console.log("Đang ngắt kết nối socket cũ...");
            stompClient.deactivate();
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