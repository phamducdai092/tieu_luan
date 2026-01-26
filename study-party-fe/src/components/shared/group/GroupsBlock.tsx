import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Users} from "lucide-react"
import RoomCard from "@/components/features/group/RoomCard.tsx"
import type {Room} from "@/types/group/group.type.ts"
import type {EnumItem} from "@/types/enum.type.ts"
import {usePresenceStore} from "@/store/presence.store.ts";


export function GroupsBlock({
                                rooms = [],
                                getEnum,
                                onRoomClick,
                                blockName,
                            }: {
    rooms: Room[] | unknown
    getEnum: (topic: string) => EnumItem | undefined
    onRoomClick?: (room: Room) => void
    blockName?: string
}) {

    const safeRooms: Room[] = Array.isArray(rooms) ? rooms : [];
    const roomCounts = usePresenceStore(state => state.roomCounts);

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>
                        {blockName ? `${blockName}` : "Phòng học"}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {safeRooms.length > 0 ?
                    (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {safeRooms.slice(0, 4).map((r) => (
                            <RoomCard
                                key={r.id}
                                room={r}
                                enumItem={getEnum(r.topic)}
                                onClick={() => onRoomClick?.(r)}
                                onlineCount={roomCounts[r.id] || 0}
                            />
                        ))}
                    </div>)
                    :
                    (<div className="grid grid-cols-1 gap-4 sm:grid-cols-1">

                        <div className="text-sm text-center text-muted-foreground italic">Chưa có phòng học tập nào.
                            Hãy tạo phòng mới
                            để bắt đầu!
                        </div>

                    </div>)
                }
            </CardContent>
        </Card>
    )
}