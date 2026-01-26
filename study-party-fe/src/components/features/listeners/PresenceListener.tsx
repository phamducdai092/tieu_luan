import { useEffect } from 'react';
import { useGlobalSocket } from '@/context/GlobalSocketContext';
import { usePresenceStore } from '@/store/presence.store';
import useAuthStore from '@/store/auth.store'; // Import Auth Store
import http from "@/lib/http.ts";

export function PresenceListener() {
    const { client, isConnected } = useGlobalSocket();
    const { setUserOnline, setUserOffline, updateRoomCount, setOnlineUsers } = usePresenceStore();

    // Lấy user hiện tại để biết "Mình là ai"
    const user = useAuthStore(s => s.user);

    // -----------------------------------------------------------
    // 1. FETCH DANH SÁCH ONLINE (Chỉ chạy ĐÚNG 1 LẦN khi Mount)
    // -----------------------------------------------------------
    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                // Gọi API lấy danh sách hiện tại
                // Lưu ý: Check lại đúng đường dẫn API (/api/presence hay /admin/presence)
                const res = await http.get<number[]>('/presence/active-users');

                if (res.data) {
                    // Bước 1: Set danh sách từ Server về
                    setOnlineUsers(res.data);

                    // Bước 2 (QUAN TRỌNG): Sau khi set xong, lập tức nhồi "Chính mình" vào lại
                    // Để tránh trường hợp API trả về thiếu mình (do race condition)
                    const currentUser = useAuthStore.getState().user;
                    if (currentUser?.id) {
                        setUserOnline(currentUser.id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch online users", error);
            }
        };

        fetchInitialState();
    }, []); // 👈 Dependency RỖNG tuyệt đối để chặn đứng vòng lặp network

    // -----------------------------------------------------------
    // 2. FORCE SELF ONLINE (Chạy khi User đăng nhập/đổi account)
    // -----------------------------------------------------------
    useEffect(() => {
        // Đảm bảo cứ có user là hiện đèn xanh cho chính mình
        if (user?.id) {
            setUserOnline(user.id);
        }
    }, [user?.id, setUserOnline]);

    // -----------------------------------------------------------
    // 3. LẮNG NGHE SOCKET (Realtime từ người khác)
    // -----------------------------------------------------------
    useEffect(() => {
        // Thêm check !client.connected để chắc chắn socket đã sẵn sàng
        if (!client || !isConnected || !client.connected) return;

        try {
            // Nghe tin báo: Ai đó vừa Online/Offline
            const userSub = client.subscribe('/topic/presence/users', (message) => {
                if (message.body) {
                    const body = JSON.parse(message.body);
                    if (body.status === 'ONLINE') {
                        setUserOnline(body.userId);
                    } else {
                        setUserOffline(body.userId);
                    }
                }
            });

            // Nghe tin báo: Số lượng phòng thay đổi
            const roomSub = client.subscribe('/topic/presence/rooms', (message) => {
                if (message.body) {
                    const body = JSON.parse(message.body);
                    updateRoomCount(body.roomId, body.count);
                }
            });

            return () => {
                try {
                    userSub.unsubscribe();
                    roomSub.unsubscribe();
                } catch (e) {}
            };
        } catch (error) {
            console.error("Socket subscription error:", error);
        }

    }, [client, isConnected, setUserOnline, setUserOffline, updateRoomCount]); // Dependency an toàn

    return null;
}