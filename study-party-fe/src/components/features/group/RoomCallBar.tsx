import { Signal, Files, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RoomCallBarProps {
    call: any; // Replace 'any' with ReturnType<typeof useCallMock> if possible
}

export function RoomCallBar({ call }: RoomCallBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <Badge variant="secondary">{call.joined ? "Đang trong cuộc gọi" : "Đã rời"}</Badge>
                <div className={cn("flex items-center gap-1 text-xs",
                    call.quality === "good" && "text-emerald-600",
                    call.quality === "fair" && "text-amber-600",
                    call.quality === "poor" && "text-red-600"
                )}>
                    <Signal className="h-4 w-4" /> {call.quality}
                </div>
                <div className="text-xs text-muted-foreground">• {call.callTime}</div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2"><Files className="h-4 w-4" />Chia sẻ tài liệu</Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2"><Settings className="h-4 w-4" />Thiết bị</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72" align="end">
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="mb-1 text-xs text-muted-foreground">Micro</div>
                                <select className="w-full rounded-md border bg-background p-2">
                                    <option>Default – Realtek Mic</option>
                                    <option>USB Mic (Podcast)</option>
                                </select>
                            </div>
                            <div>
                                <div className="mb-1 text-xs text-muted-foreground">Camera</div>
                                <select className="w-full rounded-md border bg-background p-2">
                                    <option>Integrated – 720p</option>
                                    <option>USB Cam – 1080p</option>
                                </select>
                            </div>
                            <div>
                                <div className="mb-1 text-xs text-muted-foreground">Loa</div>
                                <select className="w-full rounded-md border bg-background p-2">
                                    <option>Default – Speakers</option>
                                    <option>Headset</option>
                                </select>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}