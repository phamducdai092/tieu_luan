import type {Room} from "@/types/group.type.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge.tsx";
import {cn} from "@/lib/utils.ts";

export default function RoomCard({room}: { room: Room }) {
    const live = room.onlineCount > 0;
    return (
        <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.2}}>
            <Card className="hover:shadow-md transition-shadow p-0 pb-6">
                <CardHeader className="bg-gradient-to-r from-[oklch(var(--hero-from))] to-[oklch(var(--hero-to))] text-primary rounded-t-lg py-4">
                    <div className="flex items-center gap-2">
                        <Badge variant={live ? "default" : "secondary"} className="text-base gap-1">
                            <Users className="h-4 w-4"/>
                            {room.memberCount}
                        </Badge>
                        <Badge className={cn(
                            "text-base",
                            live ? "bg-success text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        )}>
                            {live ? `Đang học: ${room.onlineCount}` : "Offline"}
                        </Badge>
                    </div>
                    <CardTitle className="mt-2 text-2xl">{room.topic}</CardTitle>
                    <CardDescription className="text-white">Chủ phòng: {room.owner}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="text-base text-muted-foreground">ID: {room.id}</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Vào phòng</Button>
                        <Button variant="ghost" size="sm">Xem chi tiết</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}