import {Button} from "@/components/ui/button";
import {TopicBadge} from "@/components/shared/TopicBadge";
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import UpsertRoomDialog from "@/components/features/group/UpsertRoomDialog";
import type {RoomDetail} from "@/types/group/group.type";
import type {UserBrief} from "@/types/user.type";
import {useEnumStore} from "@/store/enum.store";
import {getEnumItem} from "@/utils/enumItemExtract";
import type {EnumItem} from "@/types/enum.type";
import {usePresenceStore} from "@/store/presence.store.ts";
import {LogOut, Users} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {leaveGroup} from "@/services/group.member.service";
import {toast} from "sonner"; //

interface RoomHeaderProps {
    roomData: RoomDetail;
    isGuest: boolean;
    isOwner: boolean;
    onUpdateSuccess: () => void;
}

export function RoomHeader({roomData, isGuest, isOwner, onUpdateSuccess}: RoomHeaderProps) {
    const navigate = useNavigate();
    const groupEnum: EnumItem[] = useEnumStore().get("GroupTopic");
    const topicEnum: EnumItem[] = useEnumStore().get("GroupTopic");
    const privacyEnum: EnumItem[] = useEnumStore().get("GroupPrivacy");
    const joinPolicyEnum: EnumItem[] = useEnumStore().get("JoinPolicy");

    const owner: UserBrief = roomData.owner as UserBrief;

    const privacyItem = roomData.groupPrivacy ? getEnumItem(privacyEnum, roomData.groupPrivacy) : null;
    const joinItem = roomData.joinPolicy ? getEnumItem(joinPolicyEnum, roomData.joinPolicy) : null;
    const topicItem = roomData.topic ? getEnumItem(topicEnum, roomData.topic) : null;

    const onlineCount = usePresenceStore(state => state.roomCounts[roomData.id] || 0);

    const handleLeaveGroup = async () => {
        // Hỏi cho chắc, đỡ bấm nhầm
        if (!window.confirm(`Bạn có chắc chắn muốn rời khỏi nhóm "${roomData.name}"?`)) {
            return;
        }

        try {
            await leaveGroup(roomData.id);
            toast.success("Đã rời nhóm thành công");
            navigate("/rooms"); // Đá về trang danh sách phòng
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi rời nhóm");
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3 justify-between w-full">
                    <div className="text-primary truncate text-3xl font-semibold">{roomData.name}</div>
                    <div className="">
                        {!isGuest && (
                            <Button
                                size="sm"
                                variant="destructive"
                                className="gap-2"
                                onClick={handleLeaveGroup}
                            >
                                <LogOut className="h-4 w-4"/>
                                Rời nhóm
                            </Button>
                        )}
                        {isOwner && (
                            <div className="items-end">
                                <UpsertRoomDialog
                                    mode="edit"
                                    slug={roomData.slug}
                                    room={{
                                        name: roomData.name,
                                        description: roomData.description,
                                        joinPolicy: String(roomData.joinPolicy),
                                        groupPrivacy: String(roomData.groupPrivacy),
                                        topic: String(roomData.topic),
                                        maxMembers: roomData.maxMembers ?? 50,
                                    }}
                                    groupTopics={groupEnum}
                                    onSuccess={onUpdateSuccess}
                                    trigger={
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                                 viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor">
                                                <path d="M12 20h9"/>
                                                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                                            </svg>
                                            Chỉnh sửa
                                        </Button>
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <TopicBadge enumItem={topicItem} fallback={roomData.topic}/>
                <TopicBadge enumItem={privacyItem} fallback={roomData.groupPrivacy}/>
                <TopicBadge enumItem={joinItem} fallback={roomData.joinPolicy}/>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                    <AvatarDisplay
                        src={owner?.avatarUrl}
                        size={48}
                        fallback={owner?.displayName}
                        userId={owner?.id}
                        showStatus={true}
                    />
                    {owner?.displayName || "Chủ nhóm"}
                </span>
                <span>•</span>
                <span>Thành viên: {roomData.memberCount ?? 0}{roomData.maxMembers ? `/${roomData.maxMembers}` : ""}</span>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                        <span
                            className={`w-2 h-2 rounded-full ${onlineCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        {onlineCount > 0 ? 'Đang hoạt động' : 'Chưa có người'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3 w-3"/>
                        {onlineCount} người đang học
                    </span>
                </div>
            </div>
        </div>
    );
}