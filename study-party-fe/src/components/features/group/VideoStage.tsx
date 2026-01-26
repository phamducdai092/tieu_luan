import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp, Hand, PhoneOff, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LocalVideoTrack, RemoteUser } from "agora-rtc-react";
import { Badge } from "@/components/ui/badge";

interface VideoStageProps {
    // roomData: RoomDetail;
    // isGuest: boolean;
    call: any;
}

export function VideoStage({ call }: VideoStageProps) {

    // 🔥 STATE: Quản lý việc thu gọn/mở rộng giao diện call
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div className="space-y-4">
            {/* 1. THANH CONTROL NHỎ GỌN (Khi thu nhỏ) */}
            {isMinimized && (
                <Card className="bg-slate-900 border-slate-800 p-3 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 animate-pulse">
                            Đang trong cuộc gọi
                        </Badge>
                        <span className="text-sm font-mono text-slate-300">{call.callTime}</span>
                        <div className="h-4 w-px bg-slate-700"></div>
                        <span className="text-xs text-slate-500">{call.remoteUsers.length} người khác</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Các nút điều khiển mini */}
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={call.toggleMic}>
                            {call.micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={call.leave}>
                            <PhoneOff className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full ml-2" onClick={() => setIsMinimized(false)}>
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            )}

            {/* 2. VIDEO GRID LỚN (Khi mở rộng) */}
            <div className={cn("transition-all duration-300 ease-in-out", isMinimized ? "hidden" : "block")}>
                <Card className="overflow-hidden bg-slate-950 border-slate-800 relative group">
                    {/* Nút thu nhỏ nằm ở góc trên phải */}
                    <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="gap-2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md" onClick={() => setIsMinimized(true)}>
                            <Minimize2 className="h-4 w-4" />
                            Thu gọn
                        </Button>
                    </div>

                    <CardContent className="p-0">
                        <div className="relative aspect-video w-full bg-muted/10">

                            {/* --- REMOTE USERS --- */}
                            <div className={cn(
                                "grid h-full w-full gap-2 p-2",
                                call.remoteUsers.length <= 1 ? "grid-cols-1" :
                                    call.remoteUsers.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                            )}>
                                {call.remoteUsers.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center text-slate-500 h-full">
                                        <div className="animate-pulse">Đang đợi người khác tham gia...</div>
                                    </div>
                                )}

                                {call.remoteUsers.map((user: any) => (
                                    <div key={user.uid} className="relative overflow-hidden rounded-lg bg-black border border-slate-700">
                                        {user.hasVideo ? (
                                            <RemoteUser user={user} cover={true} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                                                <Avatar className="h-14 w-14 border border-slate-700">
                                                    <AvatarFallback className="bg-slate-800 text-slate-400">U</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-slate-500 mt-2">Camera tắt</span>
                                            </div>
                                        )}
                                        <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-md z-10">
                                            <span className={cn("inline-block h-2 w-2 rounded-full", user.hasAudio ? "bg-green-500" : "bg-red-500")} />
                                            User {user.uid}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- LOCAL USER (PIP) --- */}
                            <div className="absolute bottom-16 right-3 h-32 w-48 overflow-hidden rounded-lg border border-slate-600 bg-black/80 shadow-2xl z-10 hover:scale-105 transition-transform">
                                {call.camOn && call.localCameraTrack ? (
                                    <LocalVideoTrack track={call.localCameraTrack} play={true} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Avatar className="h-12 w-12 border-2 border-white/30">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>Me</AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                                <div className="absolute bottom-1 left-2 text-[10px] font-medium text-white shadow-black drop-shadow-md">
                                    Bạn (Me)
                                </div>
                            </div>

                            {/* --- CONTROLS BAR (FULL) --- */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 z-20">
                                <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 backdrop-blur-lg shadow-xl">
                                    <ControlButton active={call.micOn} onClick={call.toggleMic} iconOn={<Mic className="h-5 w-5" />} iconOff={<MicOff className="h-5 w-5 text-red-400" />} label="Mic" />
                                    <ControlButton active={call.camOn} onClick={call.toggleCam} iconOn={<Video className="h-5 w-5" />} iconOff={<VideoOff className="h-5 w-5 text-red-400" />} label="Cam" />
                                    <ControlButton active={call.screenOn} onClick={call.toggleScreen} iconOn={<MonitorUp className="h-5 w-5" />} iconOff={<MonitorUp className="h-5 w-5" />} label="Share" />
                                    <ControlButton active={call.handUp} onClick={call.toggleHand} iconOn={<Hand className="h-5 w-5 text-yellow-400" />} iconOff={<Hand className="h-5 w-5" />} label="Hand" />
                                    <div className="h-6 w-px bg-slate-700 mx-1"></div>
                                    <Button size="icon" className="rounded-full bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20" onClick={call.leave}>
                                        <PhoneOff className="h-5 w-5 text-white" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ControlButton({ active, onClick, iconOn, iconOff, label }: any) {
    return (
        <Button type="button" size="icon" variant={active ? "ghost" : "secondary"} className={cn("rounded-full hover:bg-slate-800 transition-all", !active && "bg-slate-800 text-slate-400")} onClick={onClick}>
            <span className="sr-only">{label}</span>
            {active ? iconOn : iconOff}
        </Button>
    );
}