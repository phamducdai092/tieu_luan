import {create} from "zustand";
import type {RoomState} from "@/types/group.type.ts";

export const useGroupStore = create<RoomState>((set) => ({
        userRoomsJoined: [],
        userRoomsOwned: [],

        setRoomsUserJoined: (rooms) => set({ userRoomsJoined: rooms ?? [] }),
        setRoomsUserOwned:  (rooms) => set({ userRoomsOwned:  rooms ?? [] }),
    })
);