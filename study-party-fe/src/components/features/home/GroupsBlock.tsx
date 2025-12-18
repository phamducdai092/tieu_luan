import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Users, Star, Plus} from "lucide-react"
import RoomCard from "@/components/features/group/RoomCard.tsx"
import type {Room} from "@/types/group/group.type.ts"
import type {EnumItem} from "@/types/enum.type.ts"
import {QuickActions} from "@/components/features/home/QuickActions.tsx";


export function GroupsBlock({
                                rooms = [],
                                getEnum,
                                onCreate,
                                onRoomClick,
                                activeCount = 0,
                            }: {
    rooms: Room[] | unknown
    getEnum: (topic: string) => EnumItem | undefined
    onCreate?: () => void
    onRoomClick?: (room: Room) => void
    activeCount?: number
}) {

    const safeRooms: Room[] = Array.isArray(rooms) ? rooms : [];

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Nhóm học tập</CardTitle>
                    <div className="flex gap-3">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"/>
                            {activeCount} nhóm hoạt động
                        </Badge>
                        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={onCreate}>
                            <Plus className="w-3 h-3"/>Tạo nhóm mới
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {safeRooms.length > 0 ?
                    (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {safeRooms.map((r) => (<RoomCard key={r.id} room={r} enumItem={getEnum(r.topic)}
                                                         onClick={() => onRoomClick?.(r)}/>))
                        }
                    </div>)
                    :
                    (<div className="grid grid-cols-1 gap-4 sm:grid-cols-1">

                        <div className="text-sm text-center text-muted-foreground italic">Chưa có nhóm học tập nào.
                            Hãy tạo nhóm mới
                            để bắt đầu!
                        </div>

                    </div>)
                }
                <div className="mt-6 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><Star
                        className="h-4 w-4 text-primary"/>
                        Hành động nhanh
                    </h3>
                    <QuickActions/>
                </div>
            </CardContent>
        </Card>
    )
}