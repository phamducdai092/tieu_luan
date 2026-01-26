import http from "@/lib/http";
import type {PagingPayload} from "@/types/paging.type.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {Room, RoomDetail} from "@/types/group/group.type.ts";
import type {CreateRoomFormValues} from "@/types/schema/group.schema.ts";

// group services
export const getRoomsDiscover = async (pagingPayload?: PagingPayload) => {
    const res = await http.get<Room[]>("groups/discover", {params: pagingPayload});
    return res as UnwrappedResponse<Room[]>;
};

export const getRoomsUserJoined = async (pagingPayload?: PagingPayload) => {
    const res = await http.get<Room[]>("groups/joined", {params: pagingPayload});
    return res as UnwrappedResponse<Room[]>;
};

export const getRoomsUserOwned = async (pagingPayload?: PagingPayload) => {
    const res = await http.get<Room[]>("groups/owned", {params: pagingPayload})
    return res as UnwrappedResponse<Room[]>;
}

export const createRoom = async (createRoomPayload: CreateRoomFormValues) => {
    const res = await http.post<ApiResponse<Room>>("groups", createRoomPayload);
    return res.data;
}

export const updateRoom = async (slug: string, updateRoomPayload: Partial<CreateRoomFormValues>) => {
    const res = await http.put<ApiResponse<Room>>(`groups/${slug}`, updateRoomPayload);
    return res.data;
}
export const getRoomDetailBySlug = async (slug: string) => {
    const res = await http.get<ApiResponse<RoomDetail>>(`groups/${slug}`);
    return res.data;
}