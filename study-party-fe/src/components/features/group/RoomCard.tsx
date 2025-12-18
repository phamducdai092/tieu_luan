import type {Room} from "@/types/group/group.type.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {ChevronRight, Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import type {EnumItem} from "@/types/enum.type.ts";
import {TopicBadge} from "@/components/shared/TopicBadge.tsx";
import {Badge} from "@/components/ui/badge.tsx";

export default function RoomCard({room, onClick, enumItem}: { room: Room; onClick?: () => void; enumItem?: EnumItem }) {
    const live = true;
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 shadow-md"
              onClick={onClick}>
            <div className="h-1 bg-gradient-to-r bg-primary"/>
            <CardHeader className="py-0">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3
                            className="font-semibold text-2xl text-wrap text-primary pb-4 mb-4 border-b-2 border-primary group-hover:text-info transition-colors"
                        >
                            {room.name}
                        </h3>
                        <div className="flex items-center gap-2 my-2">
                            <TopicBadge enumItem={enumItem} fallback={room.topic}/>
                            <Badge
                                className={cn(
                                    "text-xs px-2 py-0.5",
                                    live
                                        ? "bg-success/10 text-success border-success/20"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                20 đang online
                            </Badge>
                        </div>
                        <div className="text-sm mt-4 text-muted-foreground space-y-1">
                            <div className="ml-1 flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3"/>
                                                            {room.memberCount} thành viên
                                                        </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className={cn(
                            "flex-1",
                            live
                                ? "bg-success hover:bg-success/90 text-white"
                                : ""
                        )}
                        variant={live ? "default" : "outline"}
                    >
                        {"Vào phòng"}
                    </Button>
                    <Button size="sm" variant="ghost" className="px-2">
                        <ChevronRight className="h-5 w-5"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}