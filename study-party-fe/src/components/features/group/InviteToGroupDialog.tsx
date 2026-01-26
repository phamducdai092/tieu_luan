import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Loader2, Send } from "lucide-react";
import { useGroupStore } from "@/store/group.store";
import { inviteService } from "@/services/invite.service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useEnumStore } from "@/store/enum.store";
import { getEnumItem } from "@/utils/enumItemExtract";

interface InviteToGroupDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    inviteeEmail: string;
    inviteeName: string;
}

export function InviteToGroupDialog({
                                        isOpen,
                                        onOpenChange,
                                        inviteeEmail,
                                        inviteeName
                                    }: InviteToGroupDialogProps) {
    const userRoomsOwned = useGroupStore((state) => state.userRoomsOwned);
    const groupTopics = useEnumStore().get("GroupTopic");

    // Lưu slug của nhóm đang được xử lý để hiện loading ở đúng nút đó
    const [processingSlug, setProcessingSlug] = useState<string | null>(null);

    const handleInvite = async (groupSlug: string, groupName: string) => {
        try {
            setProcessingSlug(groupSlug);

            await inviteService.createInvitation(groupSlug, {
                email: inviteeEmail
            });

            toast.success(`Đã gửi lời mời đến ${inviteeName} vào nhóm "${groupName}"`);

            // Tùy chọn: Có muốn đóng dialog luôn sau khi mời thành công 1 nhóm không?
            // onOpenChange(false);
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Có lỗi xảy ra khi gửi lời mời";
            toast.error(msg);
        } finally {
            setProcessingSlug(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Mời vào nhóm học tập</DialogTitle>
                    <DialogDescription>
                        Chọn nhóm mà bạn muốn mời <b>{inviteeName}</b> ({inviteeEmail}) tham gia.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4 -mr-4">
                    <div className="space-y-4 pt-2">
                        {userRoomsOwned.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>Bạn chưa sở hữu nhóm nào.</p>
                                <p className="text-sm mt-2">Hãy tạo nhóm mới để bắt đầu mời bạn bè!</p>
                            </div>
                        ) : (
                            userRoomsOwned.map((room) => {
                                const topicItem = getEnumItem(groupTopics, room.topic);
                                const isProcessing = processingSlug === room.slug;

                                return (
                                    <div
                                        key={room.id}
                                        className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {/* Avatar Nhóm (Giả lập bằng chữ cái đầu) */}
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarImage src={`https://ui-avatars.com/api/?name=${room.name}&background=random`} />
                                                <AvatarFallback>{room.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>

                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold truncate text-sm">
                                                    {room.name}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {room.memberCount}/{room.maxMembers}
                                                    </span>
                                                    <span>•</span>
                                                    {topicItem && (
                                                        <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">
                                                            {topicItem.label}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            variant={isProcessing ? "outline" : "default"}
                                            disabled={isProcessing}
                                            onClick={() => handleInvite(room.slug, room.name)}
                                            className="ml-2 shrink-0"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Mời <Send className="ml-1 h-3 w-3" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}