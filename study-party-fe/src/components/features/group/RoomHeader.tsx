import { Button } from "@/components/ui/button";
import { TopicBadge } from "@/components/shared/TopicBadge";
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import UpsertRoomDialog from "@/components/features/group/UpsertRoomDialog";
import type {RoomDetail} from "@/types/group/group.type";
import type {UserBrief} from "@/types/user.type";
import { useEnumStore } from "@/store/enum.store";
import { getEnumItem } from "@/utils/enumItemExtract";
import type {EnumItem} from "@/types/enum.type";

interface RoomHeaderProps {
    roomData: RoomDetail;
    isOwner: boolean;
    onUpdateSuccess: () => void;
}

export function RoomHeader({ roomData, isOwner, onUpdateSuccess }: RoomHeaderProps) {
    const groupEnum: EnumItem[] = useEnumStore().get("GroupTopic");
    const topicEnum: EnumItem[] = useEnumStore().get("GroupTopic");
    const privacyEnum: EnumItem[] = useEnumStore().get("GroupPrivacy");
    const joinPolicyEnum: EnumItem[] = useEnumStore().get("JoinPolicy");

    const owner: UserBrief = roomData.owner as UserBrief;

    const privacyItem = roomData.groupPrivacy ? getEnumItem(privacyEnum, roomData.groupPrivacy) : null;
    const joinItem = roomData.joinPolicy ? getEnumItem(joinPolicyEnum, roomData.joinPolicy) : null;
    const topicItem = roomData.topic ? getEnumItem(topicEnum, roomData.topic) : null;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="text-primary truncate text-3xl font-semibold">{roomData.name}</div>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                        </svg>
                                        Chỉnh sửa
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <TopicBadge enumItem={topicItem} fallback={roomData.topic} />
                <TopicBadge enumItem={privacyItem} fallback={roomData.groupPrivacy} />
                <TopicBadge enumItem={joinItem} fallback={roomData.joinPolicy} />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                    <AvatarDisplay src={owner?.avatarUrl} size={48} />
                    {owner?.displayName || "Chủ nhóm"}
                </span>
                <span>•</span>
                <span>Thành viên: {roomData.memberCount ?? 0}{roomData.maxMembers ? `/${roomData.maxMembers}` : ""}</span>
            </div>
        </div>
    );
}