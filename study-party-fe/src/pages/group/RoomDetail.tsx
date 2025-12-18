import {useParams, useSearchParams} from "react-router-dom";
import {useCallMock} from "@/hooks/useCallMock";
import {useRoomRealtime} from "@/hooks/useRoomRealtime";
import {RoomHeader} from "@/components/features/group/RoomHeader";
import {RoomCallBar} from "@/components/features/group/RoomCallBar";
import {VideoStage} from "@/components/features/group/VideoStage";
import {RoomTabs} from "@/components/features/group/RoomTabs";

export default function RoomDetailCallUI() {
    const {slug} = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "chat";

    // Hooks logic
    const call = useCallMock();
    const {roomData, isLoading, error, isGuest, isOwner, isMod, reloadRoomData} = useRoomRealtime(slug);
    const canEdit = isOwner || isMod;
    if (isLoading) return <div className="flex h-screen items-center justify-center">Đang tải thông tin phòng...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
    if (!roomData) return <div className="flex h-screen items-center justify-center">Không tìm thấy dữ liệu
        phòng.</div>;
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="mx-auto max-w-7xl p-6 space-y-6">

                {/* Header: Title, Edit, Badges */}
                <RoomHeader
                    roomData={roomData}
                    isOwner={isOwner}
                    onUpdateSuccess={reloadRoomData}
                />

                {/* Top Bar: Call Status & Settings */}
                {!isGuest && <RoomCallBar call={call}/>}

                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <VideoStage
                            roomData={roomData}
                            isGuest={isGuest}
                            call={call}
                        />
                    </div>

                    <div className="space-y-4">
                        <RoomTabs
                            activeTab={activeTab}
                            roomData={roomData}
                            canEdit={canEdit}
                            isGuest={isGuest}
                            onTabChange={(val) => setSearchParams({tab: val}, {replace: true})}
                        />
                    </div>
                </div>

                {/* Footer Hints */}
                {!isGuest && (
                    <div className="text-xs text-muted-foreground">
                        Phím tắt: <kbd className="rounded bg-muted px-1">M</kbd> mic · <kbd
                        className="rounded bg-muted px-1">V</kbd> cam · <kbd
                        className="rounded bg-muted px-1">S</kbd> share · <kbd
                        className="rounded bg-muted px-1">H</kbd> hand · <kbd
                        className="rounded bg-muted px-1">L</kbd> leave
                    </div>
                )}
            </div>
        </div>
    );
}