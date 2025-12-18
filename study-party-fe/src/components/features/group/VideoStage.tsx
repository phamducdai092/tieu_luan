import React from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp, Hand, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import GuestIntroCard from "@/components/features/group/GuestIntroCard";
import Pomodoro from "@/components/shared/Pomodoro";
import type {RoomDetail} from "@/types/group/group.type";
import { useEnumStore } from "@/store/enum.store";
import { getEnumItem } from "@/utils/enumItemExtract";
import { createJoinRequest } from "@/services/join_request.service";
import { toast } from "sonner";

interface VideoStageProps {
    roomData: RoomDetail;
    isGuest: boolean;
    call: any;
}

export function VideoStage({ roomData, isGuest, call }: VideoStageProps) {
    const topicEnum = useEnumStore().get("GroupTopic");
    const privacyEnum = useEnumStore().get("GroupPrivacy");
    const joinPolicyEnum = useEnumStore().get("JoinPolicy");

    const privacyItem = roomData.groupPrivacy ? getEnumItem(privacyEnum, roomData.groupPrivacy) : null;
    const joinItem = roomData.joinPolicy ? getEnumItem(joinPolicyEnum, roomData.joinPolicy) : null;
    const topicItem = roomData.topic ? getEnumItem(topicEnum, roomData.topic) : null;

    const handleJoinNow = () => { console.log("join now clicked"); };

    const handleRequestJoin = async () => {
        try {
            await createJoinRequest(roomData.slug);
            toast.success("Yêu cầu tham gia đã được gửi.");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Lỗi gửi yêu cầu.");
        }
    };

    if (isGuest) {
        return (
            <GuestIntroCard
                name={roomData.name}
                description={roomData.description}
                topicItem={topicItem}
                privacyItem={privacyItem}
                joinItem={joinItem}
                onJoinNow={handleJoinNow}
                onRequestJoin={handleRequestJoin}
            />
        );
    }

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="relative aspect-video w-full bg-muted">
                        {/* Remote tiles grid (mock) */}
                        <div className="grid h-full w-full grid-cols-2 gap-2 p-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative overflow-hidden rounded-lg bg-black/80">
                                    <div className="absolute inset-0 flex items-center justify-center text-white/70">Remote {i}</div>
                                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs text-white">
                                        <span className="inline-block h-2 w-2 rounded-full bg-success" /> Online
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Local preview */}
                        <div className="absolute bottom-3 right-3 h-28 w-48 overflow-hidden rounded-lg border bg-black/70">
                            <div className="absolute inset-0 flex items-center justify-center text-white/70">Bạn</div>
                            {!call.camOn && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Avatar className="h-12 w-12 border-2 border-white/30">
                                        <AvatarImage src="https://i.pravatar.cc/120?img=5" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                        </div>

                        {/* Bottom controls */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center pb-4">
                            <div className="pointer-events-auto flex items-center gap-2 rounded-full border bg-background/90 px-2 py-1 backdrop-blur">
                                <ControlButton active={call.micOn} onClick={call.toggleMic} iconOn={<Mic className="h-5 w-5" />} iconOff={<MicOff className="h-5 w-5" />} label="Mic" />
                                <ControlButton active={call.camOn} onClick={call.toggleCam} iconOn={<Video className="h-5 w-5" />} iconOff={<VideoOff className="h-5 w-5" />} label="Cam" />
                                <ControlButton active={call.screenOn} onClick={call.toggleScreen} iconOn={<MonitorUp className="h-5 w-5" />} iconOff={<MonitorUp className="h-5 w-5" />} label="Share" />
                                <ControlButton active={call.handUp} onClick={call.toggleHand} iconOn={<Hand className="h-5 w-5" />} iconOff={<Hand className="h-5 w-5" />} label="Hand" />
                                <Button size="icon" className="rounded-full bg-red-600 hover:bg-red-700" onClick={call.leave}>
                                    <PhoneOff className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Pomodoro title="Pomodoro nhóm" />
        </div>
    );
}

// Helper Component nhỏ chỉ dùng trong VideoStage
function ControlButton({ active, onClick, iconOn, iconOff, label }: any) {
    return (
        <Button type="button" size="icon" variant={active ? "default" : "secondary"} className={cn("rounded-full", !active && "opacity-80")} onClick={onClick}>
            <span className="sr-only">{label}</span>
            {active ? iconOn : iconOff}
        </Button>
    );
}