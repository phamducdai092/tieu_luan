import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getAccess } from "@/lib/token";

interface GlobalSocketContextType {
    client: Client | null;
    isConnected: boolean;
    sendMessage: (destination: string, body: any) => void;
}

const GlobalSocketContext = createContext<GlobalSocketContextType>({
    client: null,
    isConnected: false,
    sendMessage: () => {},
});

export const useGlobalSocket = () => useContext(GlobalSocketContext);

export function GlobalSocketProvider({ children }: { children: React.ReactNode }) {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Lấy token để check login
    const token = getAccess();

    useEffect(() => {
        // Chỉ connect khi có token (đã login)
        if (!token) {
            // Nếu mất token (logout), disconnect nếu đang nối
            if (client && client.active) {
                console.log("👋 [Global Socket] Token missing, disconnecting...");
                client.deactivate();
                setClient(null);
                setIsConnected(false);
            }
            return;
        }

        // Nếu đã có client đang active thì không tạo mới (Singleton)
        if (client && client.active) return;

        console.log("🔌 [Global Socket] Initializing...");

        // 1. Xác định URL chuẩn
        // Nếu VITE_API_URL = "http://localhost:8080/api", socket sẽ là ".../api/ws"
        const socketUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080/api") + "/ws";

        // 2. Khởi tạo SockJS & Stomp
        const socket = new SockJS(socketUrl);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Tự động reconnect sau 5s
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log("✅ [Global Socket] Connected Successfully!");
                setIsConnected(true);
            },
            onDisconnect: () => {
                console.log("❌ [Global Socket] Disconnected");
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error("🚨 [Global Socket] Error:", frame.headers["message"]);
            },
        });

        // 3. Kích hoạt
        stompClient.activate();
        setClient(stompClient);

        // Cleanup function
        return () => {
            // Không deactivate ở đây nếu muốn giữ kết nối khi chuyển trang
            // Chỉ deactivate khi component Provider bị unmount hoàn toàn (ví dụ tắt app)
        };
    }, [token]); // Chạy lại khi token thay đổi (Login/Logout)

    // Hàm gửi tin nhắn wrapper cho tiện
    const sendMessage = (destination: string, body: any) => {
        if (client && client.active && isConnected) {
            client.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.warn("⚠️ [Global Socket] Cannot send, client not ready.");
        }
    };

    return (
        <GlobalSocketContext.Provider value={{ client, isConnected, sendMessage }}>
            {children}
        </GlobalSocketContext.Provider>
    );
}