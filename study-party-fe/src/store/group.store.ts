import {create} from "zustand";
import type {Room, RoomState} from "@/types/group/group.type.ts";

export const useGroupStore = create<RoomState>((set) => ({
        userRoomsJoined: [],
        userRoomsOwned: [],
        discoverRooms: [],

        setRoomsUserJoined: (rooms: Room[]) => set({userRoomsJoined: rooms ?? []}),
        setRoomsUserOwned: (rooms: Room[]) => set({userRoomsOwned: rooms ?? []}),
        setDiscoverRooms: (rooms: Room[]) => set({discoverRooms: rooms ?? []}),
    })
);