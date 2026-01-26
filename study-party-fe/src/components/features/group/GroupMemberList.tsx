import {useQueryClient} from "@tanstack/react-query";
import {
    kickGroupMember,
    setMemberRole,
} from "@/services/group.member.service.ts";
import {Loader2, Search} from "lucide-react";
import {toast} from "sonner";
import {useState} from "react";
import type {MemberResponse} from "@/types/group/member.type.ts";
import {AppPagination} from "@/components/common/AppPagination";
import type {PagingResponse} from "@/types/paging.type.ts";
import {GroupMemberCard} from "@/components/features/group/GroupMemberCard.tsx";
import {type MemberRole} from "@/types/enum/group.enum.ts";
import {groupKeys, useGroupMembers} from "@/hooks/useGroupMember.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";

// Định nghĩa kiểu dữ liệu trả về của Query để code gợi ý cho sướng
type GroupMemberQueryResult = {
    items: MemberResponse[];
    meta: PagingResponse; // Hoặc PagingResponse
}

export function GroupMemberList({groupId, canEdit}: { groupId: number, canEdit: boolean }) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    // 1. State trang hiện tại
    const [currentPage, setCurrentPage] = useState(0);

    const queryClient = useQueryClient();

    // 2. Cấu hình useQuery chuẩn cho Pagination
    const {data, isLoading, isPlaceholderData} = useGroupMembers(groupId, {
        page: currentPage,
        size: 5
    });

    // Tách data ra cho dễ dùng
    const members = data?.items || [];
    const paging = data?.meta;

    // --- LOGIC XỬ LÝ ACTION ---
    const handleKickMember = async (memberId: number) => {
        try {
            setProcessingId(memberId);
            await kickGroupMember(groupId, memberId);
            toast.success("Đã loại thành viên khỏi nhóm");

            // Update Cache: Lưu ý cấu trúc cache giờ đã đổi thành { items, meta }
            queryClient.setQueryData(
                groupKeys.list(groupId, currentPage, 5),
                (old: any) => {
                    return {
                        ...old, // Giữ nguyên meta
                        items: old.items.filter(m => m.member.id !== memberId) // Lọc mảng items
                    };
                }
            );
        } catch (error) {
            toast.error("Có lỗi xảy ra khi loại thành viên.");
        } finally {
            setProcessingId(null);
        }
    }

    const handleChangeMemberRole = async (memberId: number, newMemberRole: MemberRole) => {
        try {
            setProcessingId(memberId);
            await setMemberRole(groupId, memberId, newMemberRole);
            toast.success("Đã thay đổi vai trò của thành viên.");

            // Update Cache thông minh
            queryClient.setQueryData(
                ["group-members", groupId, currentPage],
                (old: GroupMemberQueryResult | undefined) => {
                    if (!old) return old;
                    return {
                        ...old,
                        items: old.items.map(m => {
                            // Tìm đúng member đang sửa
                            if (m.member.id === memberId) {
                                // Trả về object mới với role mới
                                return {...m, role: newMemberRole};
                            }
                            return m; // Các member khác giữ nguyên
                        })
                    };
                }
            );
        } catch (error: any) {
            console.log(error?.response?.data?.message ||
                error?.message)
            toast.error("Có lỗi xảy ra khi thay đổi vai trò.");
        } finally {
            setProcessingId(null);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-2 overflow-hidden">
            <div className="relative shrink-0 px-1"> {/* Thêm px-1 để outline input không bị cắt */}
                <Search
                    className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                <Input placeholder="Tìm thành viên..." className="pl-8 bg-background"/>
            </div>

            <ScrollArea className="flex-1 min-h-0 w-full pr-3 -mr-3">
                <div
                    className={isPlaceholderData ? "opacity-50 space-y-2" : "flex flex-col gap-y-2 space-y-2"}>
                    {members.map((mem) => (
                        canEdit ?
                            (
                                <GroupMemberCard
                                    memberResponse={mem}
                                    key={mem.member.id}
                                    onChangeRole={(memId, roleMoi) => handleChangeMemberRole(memId, roleMoi)}
                                    onKickMember={() => handleKickMember(mem.member.id)}
                                />
                            ) : (
                                <GroupMemberCard
                                    memberResponse={mem}
                                    key={mem.member.id}
                                />
                            )
                    ))}
                </div>
            </ScrollArea>
            {/* Component Phân trang */}
            {paging && (
                <div className="pt-2 border-t mt-auto shrink-0">
                    <AppPagination
                        page={paging.page}
                        totalPages={paging.totalPages}
                        totalItems={paging.totalItems}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}