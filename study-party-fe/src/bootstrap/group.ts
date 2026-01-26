import {useGroupStore} from "@/store/group.store.ts";
import {getRoomsUserJoined, getRoomsUserOwned} from "@/services/group.service.ts";

export async function bootstrapGroups() {
    const [joinedRes, ownedRes] = await Promise.all([
        getRoomsUserJoined({ page: 0, size: 4, sort: 'createdAt' }),
        getRoomsUserOwned({ page: 0, size: 4, sort: 'createdAt' }),
    ]);

    const { setRoomsUserJoined, setRoomsUserOwned } = useGroupStore.getState();

    // Lưu vào store để Dashboard dùng
    setRoomsUserJoined(joinedRes?.data ?? []);
    setRoomsUserOwned(ownedRes?.data ?? []);
}