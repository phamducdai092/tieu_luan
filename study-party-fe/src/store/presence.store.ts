import { create } from 'zustand';

interface PresenceState {
    onlineUserIds: Set<number>; // Dùng Set để tra cứu O(1) cực nhanh
    roomCounts: Record<number, number>; // Map: roomId -> count

    // Actions
    setUserOnline: (userId: number) => void;
    setUserOffline: (userId: number) => void;
    setOnlineUsers: (userIds: number[]) => void; // Init lúc đầu

    updateRoomCount: (roomId: number, count: number) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
    onlineUserIds: new Set(),
    roomCounts: {},

    setUserOnline: (userId) => set((state) => {
        const newSet = new Set(state.onlineUserIds);
        newSet.add(userId);
        return { onlineUserIds: newSet };
    }),

    setUserOffline: (userId) => set((state) => {
        const newSet = new Set(state.onlineUserIds);
        newSet.delete(userId);
        return { onlineUserIds: newSet };
    }),

    setOnlineUsers: (userIds) => set(() => ({
        onlineUserIds: new Set(userIds)
    })),

    updateRoomCount: (roomId, count) => set((state) => ({
        roomCounts: {
            ...state.roomCounts,
            [roomId]: count
        }
    }))
}));