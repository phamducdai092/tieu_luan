import type {MemberResponse} from "@/types/group/member.type.ts";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";
import {TopicBadge} from "@/components/shared/TopicBadge.tsx";
import {useEnumStore} from "@/store/enum.store.ts";
import {getEnumItem} from "@/utils/enumItemExtract.ts";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCcw, UserX, Shield, User} from "lucide-react"; // Thêm icon cho menu đẹp hơn
import {type MemberRole, MemberRoleEnum} from "@/types/enum/group.enum.ts";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {DialogTitle} from "@radix-ui/react-dialog";
import useAuthStore from "@/store/auth.store.ts";
import {cn} from "@/lib/utils.ts";

interface GroupMemberCardProps {
    memberResponse: MemberResponse;
    onKickMember?: (memberId: number) => void;
    onChangeRole?: (memberId: number, newMemberRole: MemberRole) => void;
}

export function GroupMemberCard({memberResponse, onKickMember, onChangeRole}: GroupMemberCardProps) {
    const {member, role} = memberResponse;
    const memberRoleEnum = useEnumStore().get("MemberRole");
    const memberRoleEnumItem = getEnumItem(memberRoleEnum, role);
    const {user} = useAuthStore();

    const isMe = user?.id !== member.id; // check xem có phải bản thân hay k
    const isOwner = role !== MemberRoleEnum.OWNER;

    // Helper: Kiểm tra xem có nên hiện option này không (không hiện role hiện tại)
    const isCurrentRole = (targetRole: MemberRole) => role === targetRole;

    return (
        <div
            className={cn("flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm hover:bg-accent/50 transition-colors",
                isMe
                    ? ""
                    : "border-lime-500"
            )}>
            {/* Phần Thông tin User */}
            <div className={cn(
                "flex items-center gap-3 overflow-hidden"
            )}>
                <AvatarDisplay src={member.avatarUrl} fallback={member.displayName} size={48}/>

                <div className="flex flex-col min-w-0">
                    <span className="self-start text-sm font-semibold truncate max-w-[150px] sm:max-w-[200px]">
                        {member.displayName || "Thành viên"}
                    </span>
                    <div className="flex mt-1">
                        <TopicBadge enumItem={memberRoleEnumItem} fallback={role}/>
                    </div>
                </div>
            </div>

            {/* Phần Nút Hành động */}
            {/* Kiểm tra vai trò của user */}
            {isOwner &&
                isMe && (
                    <div className="flex items-center gap-2 ml-4">

                        {/* 2. Logic Dropdown Menu cho nút Đổi vai trò */}
                        {onChangeRole && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        title="Đổi vai trò"
                                    >
                                        <RefreshCcw className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Chọn vai trò mới</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>

                                    {/* Option: MOD */}
                                    <DropdownMenuItem
                                        disabled={isCurrentRole(MemberRoleEnum.MOD)}
                                        onClick={() => onChangeRole(member.id, MemberRoleEnum.MOD)}
                                        className="cursor-pointer"
                                    >
                                        <Shield className="mr-2 h-4 w-4 text-blue-500"/>
                                        <span>Quản trị viên (MOD)</span>
                                    </DropdownMenuItem>

                                    {/* Option: MEMBER */}
                                    <DropdownMenuItem
                                        disabled={isCurrentRole(MemberRoleEnum.MEMBER)}
                                        onClick={() => onChangeRole(member.id, MemberRoleEnum.MEMBER)}
                                        className="cursor-pointer"
                                    >
                                        <User className="mr-2 h-4 w-4 text-zinc-500"/>
                                        <span>Thành viên (MEMBER)</span>
                                    </DropdownMenuItem>

                                    {/* M có thể thêm OWNER nếu muốn chuyển quyền sở hữu ở đây luôn */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {onKickMember && (
                            <Dialog>
                                <form>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            title="Mời ra khỏi nhóm"
                                        >
                                            <UserX className="h-4 w-4"/>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Xác nhận mời {member.displayName || "Thành viên"} ra khỏi
                                                nhóm</DialogTitle>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Hủy</Button>
                                            </DialogClose>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => onKickMember(member.id)}
                                                title="Mời ra khỏi nhóm"
                                            >
                                                <UserX className="h-4 w-4"/>
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </form>
                            </Dialog>
                        )}
                    </div>
                )}
        </div>
    );
}