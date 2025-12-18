import {useEffect} from "react";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {toast} from "sonner";
import {getAccess} from "@/lib/token";
import useAuthStore from "@/store/auth.store";
import {SOCKET_EVENTS, SOCKET_TOPICS, type SocketMessage} from "@/config/socket.config";

export function NotificationListener() {
    const {user} = useAuthStore(); // Lấy thông tin user đang đăng nhập

    useEffect(() => {
        const token = getAccess();
        if (!user?.id || !token) return;

        const socket = new SockJS(import.meta.env.VITE_API_URL + "/ws");

        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log("🔔 Connected to Notification System");

                // Subscribe kênh riêng tư của user
                // /topic/user/{userId}/notifications
                stompClient.subscribe(SOCKET_TOPICS.userNotifications(user.id), (message) => {
                    const msgBody = JSON.parse(message.body) as SocketMessage;

                    if (msgBody.type === SOCKET_EVENTS.NEW_NOTIFICATION) {
                        const notif = msgBody.payload;

                        // 1. Trường hợp ĐƯỢC DUYỆT (Xanh lá - Vui)
                        if (notif.type === SOCKET_EVENTS.JOIN_REQUEST_APPROVED) {
                            toast.success("Yêu cầu được chấp nhận! 🎉", {
                                description: notif.content,
                                duration: 5000,
                                action: {
                                    label: "Vào ngay",
                                    onClick: () => window.location.href = notif.link,
                                },
                            });
                        }
                        // 2. Trường hợp BỊ TỪ CHỐI (Đỏ/Cam - Buồn)
                        else if (notif.type === SOCKET_EVENTS.JOIN_REQUEST_REJECTED) {
                            toast.error("Yêu cầu bị từ chối", {
                                description: notif.content,
                                duration: 5000,
                            });
                        }
                        // Notification role change
                        else if (notif.type === SOCKET_EVENTS.MEMBER_ROLE_CHANGE) {
                            toast.info("Vai trò trong nhóm của bạn vừa thay đổi", {
                                description: notif.content,
                                duration: 5000,
                                action: {
                                    label: "Vào ngay",
                                    onClick: () => window.location.href = notif.link,
                                },
                            });
                        }
                        // 3. Các thông báo khác (Mặc định)
                        else {
                            toast(notif.content, {
                                action: notif.link ? {
                                    label: "Xem",
                                    onClick: () => window.location.href = notif.link,
                                } : undefined,
                            });
                        }

                        // TODO: Gọi hàm reload list thông báo ở store (nếu m làm dropdown thông báo)
                    }
                });
            },
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) stompClient.deactivate();
        };
    }, [user?.id]);

    return null; // Component này không hiện gì ra UI cả (invisible)
}