import {useGroupStore} from "@/store/group.store.ts";
import {getRoomsUserJoined, getRoomsUserOwned} from "@/services/group.service.ts";


export async function bootstrapGroups() {
    const [joined, owned] = await Promise.all([
        getRoomsUserJoined(),
        getRoomsUserOwned(),
    ])

    const { setRoomsUserJoined, setRoomsUserOwned } = useGroupStore.getState();
    setRoomsUserJoined(joined ?? []);
    setRoomsUserOwned(owned ?? []);
}
