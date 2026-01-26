import {useState, useMemo} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import AgoraRTC, {AgoraRTCProvider, useRTCClient} from "agora-rtc-react";
import {toast} from "sonner";
import {Phone, Loader2} from "lucide-react";

import {useRoomRealtime} from "@/hooks/useRoomRealtime";
import {useAgoraCall} from "@/hooks/useAgoraCall";
import {Button} from "@/components/ui/button";

// Components UI
import {RoomHeader} from "@/components/features/group/RoomHeader";
import {RoomCallBar} from "@/components/features/group/RoomCallBar";
import {VideoStage} from "@/components/features/group/VideoStage";
import {RoomTabs} from "@/components/features/group/RoomTabs";
import {RoomPresenceListener} from "@/components/features/listeners/RoomPresenceListener";
import GuestIntroCard from "@/components/features/group/GuestIntroCard.tsx";
import {getEnumItem} from "@/utils/enumItemExtract.ts";
import {createJoinRequest} from "@/services/join_request.service.ts";
import {useEnumStore} from "@/store/enum.store.ts";
import Pomodoro from "@/components/shared/Pomodoro.tsx";
import {callService} from "@/services/call.service.ts";
import RoomContext from "@/context/GroupContext";

// --- COMPONENT CHA ---
export default function RoomDetailCallUI() {
    const agoraClient = useRTCClient(
        useMemo(
            () => AgoraRTC.createClient({codec: "vp8", mode: "rtc"}),
            []
        )
    );

    return (
        <AgoraRTCProvider client={agoraClient}>
            {/* Đã xóa RoomSocketProvider */}
            <RoomInnerContent/>
        </AgoraRTCProvider>
    );
}

// --- COMPONENT CON ---
function RoomInnerContent() {
    const {slug} = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "chat";

    const [agoraToken, setAgoraToken] = useState<string | null | undefined>(undefined);
    const [isFetchingToken, setIsFetchingToken] = useState(false);
    const hard_app_id = "48bad891e6ea419c9b6fe812ef71890e";

    const {roomData, isLoading, error, isGuest, isOwner, isMod, reloadRoomData} = useRoomRealtime(slug);
    const myUid = useMemo(() => String(Math.floor(Math.random() * 100000)), []);

    const call = useAgoraCall(
        hard_app_id,
        roomData?.id ? String(roomData.id) : "",
        agoraToken,
        myUid,
        () => setAgoraToken(undefined)
    );

    const handleJoinCall = async () => {
        if (!roomData?.id) return;
        setIsFetchingToken(true);
        try {
            await callService(roomData.id);

            setAgoraToken(null);
            console.log("✅ Joined using App ID only mode");
        } catch (e: any) {
            toast.error("Lỗi tham gia: " + (e.response?.data?.message || e.message));
        } finally {
            setIsFetchingToken(false);
        }
    };

    const topicEnum = useEnumStore().get("GroupTopic");
    const privacyEnum = useEnumStore().get("GroupPrivacy");
    const joinPolicyEnum = useEnumStore().get("JoinPolicy");

    const privacyItem = roomData?.groupPrivacy ? (getEnumItem(privacyEnum, roomData.groupPrivacy) ?? null) : null;
    const joinItem = roomData?.joinPolicy ? (getEnumItem(joinPolicyEnum, roomData.joinPolicy) ?? null) : null;
    const topicItem = roomData?.topic ? (getEnumItem(topicEnum, roomData.topic) ?? null) : null;

    const handleRequestJoin = async () => {
        try {
            await createJoinRequest(roomData!.slug);
            toast.success("Yêu cầu tham gia đã được gửi.");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Lỗi gửi yêu cầu.");
        }
    };

    const canEdit = isOwner || isMod;

    if (isLoading) return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
    if (!roomData) return <div className="flex h-screen items-center justify-center">Không tìm thấy phòng.</div>;

    return (
        <RoomContext.Provider value={{onJoinCall: handleJoinCall}}>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">

                {roomData.id && <RoomPresenceListener roomId={roomData.id}/>}

                <div className="mx-auto max-w-7xl p-6 space-y-6">
                    <RoomHeader roomData={roomData} isGuest={isGuest} isOwner={isOwner}
                                onUpdateSuccess={reloadRoomData}/>

                    {!isGuest && call.joined && <RoomCallBar call={call}/>}

                    <div
                        className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:h-[calc(100vh-14rem)] min-h-[500px] items-stretch">
                        <div className="space-y-4 lg:col-span-2 flex flex-col h-full overflow-hidden">
                            {isGuest ? (
                                // 1. Ưu tiên check Guest trước tiên
                                <GuestIntroCard
                                    name={roomData.name}
                                    description={roomData.description}
                                    topicItem={topicItem}
                                    privacyItem={privacyItem}
                                    joinItem={joinItem}
                                    onRequestJoin={handleRequestJoin}
                                />
                            ) : call.joined ? (
                                // 2. Nếu không phải Guest và ĐÃ Join -> Hiện VideoStage
                                <div className="flex-1 min-h-0 bg-black rounded-xl overflow-hidden">
                                    <VideoStage call={call}/>
                                </div>
                            ) : (
                                // 3. Nếu không phải Guest và CHƯA Join -> Hiện nút Tham gia
                                <div
                                    className="relative aspect-video w-full h-full overflow-hidden rounded-xl border bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 shadow-lg group">
                                    <div
                                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616593871275-2748fdbb7754?q=80&w=2000')] bg-cover bg-center opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-500"></div>
                                    <div className="z-10 text-center space-y-2">
                                        <h3 className="text-xl font-semibold drop-shadow-md">Phòng
                                            họp: {roomData.name}</h3>
                                        <p className="text-slate-400 text-sm drop-shadow-md">Sẵn sàng kết nối với mọi
                                            người?</p>
                                    </div>
                                    <Button
                                        size="lg"
                                        onClick={handleJoinCall}
                                        disabled={isFetchingToken}
                                        className="z-10 bg-green-600 hover:bg-green-700 gap-2 shadow-xl hover:scale-105 transition-all"
                                    >
                                        {isFetchingToken ? <Loader2 className="animate-spin"/> :
                                            <Phone className="w-5 h-5"/>}
                                        Tham gia ngay
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 h-full min-h-0">
                            <RoomTabs
                                activeTab={activeTab}
                                roomData={roomData}
                                canEdit={canEdit}
                                isGuest={isGuest}
                                onTabChange={(val) => setSearchParams({tab: val}, {replace: true})}
                            />
                        </div>
                    </div>

                    {/* Pomodoro luôn hiện (Khi thu nhỏ Call thì nó sẽ nổi bật hơn) */}
                    {!isGuest && (
                        <Pomodoro title="Pomodoro nhóm"/>
                    )}

                    {!isGuest && call.joined && (
                        <div className="text-xs text-muted-foreground animate-in fade-in duration-500">
                            Phím tắt: <kbd className="rounded bg-muted px-1">M</kbd> mic · <kbd
                            className="rounded bg-muted px-1">L</kbd> leave
                        </div>
                    )}
                </div>
            </div>
        </RoomContext.Provider>
    );
}