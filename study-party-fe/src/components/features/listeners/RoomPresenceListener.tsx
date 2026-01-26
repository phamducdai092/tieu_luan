import {useEffect} from 'react';
import {useGlobalSocket} from '@/context/GlobalSocketContext';
import {usePresenceStore} from '@/store/presence.store';
import http from "@/lib/http.ts";

export function RoomPresenceListener({roomId}: { roomId: number }) {
    const {client, isConnected} = useGlobalSocket();
    const {updateRoomCount} = usePresenceStore();

    useEffect(() => {
        // 1. Gọi API lấy số lượng (HTTP không liên quan socket nên để ngoài check)
        http.get<number>(`/presence/room/${roomId}/count`)
            .then(res => updateRoomCount(roomId, res.data))
            .catch(console.error);

        // 👇 FIX 1: Thêm check client.connected
        if (!client || !isConnected || !client.connected) return;

        try {
            // 👇 FIX 2: Bọc try-catch
            // Topic: /topic/room/{id}/count
            const sub = client.subscribe(`/topic/room/${roomId}/count`, (msg) => {
                if (msg.body) {
                    const count = Number(msg.body);
                    updateRoomCount(roomId, count);
                }
            });

            return () => {
                try {
                    sub.unsubscribe();
                } catch (e) {}
            };
        } catch (error) {
            console.error("Socket subscription error:", error);
        }

    }, [roomId, client, isConnected, updateRoomCount]);

    return null;
}