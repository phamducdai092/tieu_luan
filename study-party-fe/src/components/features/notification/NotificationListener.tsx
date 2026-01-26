import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { getAccess } from "@/lib/token";
import useAuthStore from "@/store/auth.store";
import { SOCKET_EVENTS, SOCKET_TOPICS, type SocketMessage } from "@/config/socket.config";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho Notification Payload
interface NotificationPayload {
    content: string;
    link: string;
    type: string;
    senderAvatar?: string; // Nếu BE có trả về
}

export function NotificationListener() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // --- 🛠 CHIẾN THUẬT XỬ LÝ (STRATEGY PATTERN) ---
    // Định nghĩa cách hiển thị cho từng loại thông báo tại đây
    const handleNotification = (notif: NotificationPayload) => {

        // Hàm chuyển trang an toàn
        const handleClick = () => {
            if (notif.link) navigate(notif.link);
        };

        switch (notif.type) {
            // 1. NHÓM SỰ KIỆN: YÊU CẦU THAM GIA (JOIN REQUEST)
            case SOCKET_EVENTS.JOIN_REQUEST_APPROVED: // Được duyệt vào nhóm
                toast.success("Yêu cầu được chấp nhận! ", {
                    description: notif.content,
                    duration: 5000,
                    action: { label: "Vào ngay", onClick: handleClick },
                });
                break;

            case SOCKET_EVENTS.JOIN_REQUEST_REJECTED: // Bị từ chối
                toast.error("Yêu cầu bị từ chối", {
                    description: notif.content,
                    duration: 5000,
                });
                break;

            case SOCKET_EVENTS.JOIN_REQUEST: // (Cho Chủ nhóm) Có người xin vào
                toast.info("Yêu cầu tham gia mới ️", {
                    description: notif.content,
                    duration: 6000, // Để lâu chút cho admin kịp nhìn
                    action: { label: "Duyệt ngay", onClick: handleClick },
                });
                break;

            // 2. NHÓM SỰ KIỆN: LỜI MỜI (INVITATION) - MỚI THÊM
            case SOCKET_EVENTS.INVITATION_RECEIVED: // Nhận được lời mời
                toast.info("Lời mời tham gia nhóm", {
                    description: notif.content,
                    duration: 8000, // Lời mời quan trọng, để lâu
                    action: { label: "Xem lời mời", onClick: handleClick },
                });
                break;

            case SOCKET_EVENTS.INVITATION_ACCEPTED: // (Cho người mời) Nó đã đồng ý
                toast.success("Lời mời được chấp nhận", {
                    description: notif.content,
                    duration: 5000,
                    action: { label: "Vào nhóm", onClick: handleClick },
                });
                break;

            case SOCKET_EVENTS.INVITATION_DECLINED: // (Cho người mời) Nó từ chối
                toast.warning("Lời mời bị từ chối", {
                    description: notif.content,
                    duration: 5000,
                });
                break;

            // 3. NHÓM SỰ KIỆN: QUẢN LÝ THÀNH VIÊN
            case SOCKET_EVENTS.MEMBER_ROLE_CHANGE: // Thăng chức / Giáng chức
                toast.info("Thay đổi vai trò 🛡️", {
                    description: notif.content,
                    action: { label: "Kiểm tra", onClick: handleClick },
                });
                break;

            case SOCKET_EVENTS.NEW_GROUP_MESSAGE:
                // Thường Chat sẽ có listener riêng, nhưng nếu muốn hiện popup khi đang ở trang khác thì handle ở đây
                // Bỏ qua nếu đang ở trong chính room đó (Check URL)
                if (!window.location.pathname.includes(notif.link)) {
                    toast.message(notif.content, {
                        description: "Tin nhắn mới",
                        action: { label: "Xem", onClick: handleClick }
                    });
                }
                break;
            case 'VIDEO_CALL_STARTED':
                toast.info("Cuộc gọi nhóm đang diễn ra 🎥", {
                    description: notif.content,
                    duration: 10000, // Để lâu chút (10s) cho người ta kịp thấy
                    action: {
                        label: "Tham gia ngay",
                        onClick: () => {
                            // Nếu đang ở trang khác -> Chuyển trang
                            navigate(notif.link);
                        }
                    },
                    // Nếu muốn đẹp thì thêm icon hoặc avatar người gọi vào đây
                });
                break;

            // 4. MẶC ĐỊNH (FALLBACK)
            default:
                toast(notif.content, {
                    action: notif.link ? { label: "Xem", onClick: handleClick } : undefined,
                });
                break;
        }
    };

    useEffect(() => {
        const token = getAccess();
        if (!user?.id || !token) return;

        const socket = new SockJS(import.meta.env.VITE_API_URL + "/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                console.log("🔔 [Notif] Connected to Notification System");

                // Subscribe kênh thông báo cá nhân
                stompClient.subscribe(SOCKET_TOPICS.userNotifications(user.id), (message) => {
                    try {
                        const msgBody = JSON.parse(message.body) as SocketMessage;

                        // Chỉ xử lý nếu đúng là loại THÔNG BÁO
                        if (msgBody.type === SOCKET_EVENTS.NEW_NOTIFICATION) {
                            const notifPayload = msgBody.payload as NotificationPayload;
                            handleNotification(notifPayload);

                            // TODO: Ở đây m có thể gọi thêm hàm cập nhật cái chuông thông báo (số lượng chưa đọc)
                            // useNotificationStore.getState().incrementUnread();
                        }
                    } catch (e) {
                        console.error("Lỗi parse notification:", e);
                    }
                });
            },
            // Tắt log debug cho đỡ rác console
            debug: () => { /* console.log(str) */ }
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) stompClient.deactivate();
        };
    }, [user?.id, navigate]); // Thêm navigate vào dep

    return null;
}