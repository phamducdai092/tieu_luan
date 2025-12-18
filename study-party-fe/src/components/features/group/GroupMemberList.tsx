import {keepPreviousData, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getGroupMembers,
    kickGroupMember,
    setMemberRole,
} from "@/services/group.member.service.ts";
import {Loader2} from "lucide-react";
import {toast} from "sonner";
import {useState} from "react";
import type {MemberResponse} from "@/types/group/member.type.ts";
import {AppPagination} from "@/components/common/AppPagination";
import type {PagingResponse} from "@/types/paging.type.ts";
import {GroupMemberCard} from "@/components/features/group/GroupMemberCard.tsx";
import {type MemberRole} from "@/types/enum/group.enum.ts";

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
    const {
        data, // Data lúc này là object { items, meta } chứ không phải mảng
        isLoading,
        isPlaceholderData // Biến này true khi đang fetch trang mới mà vẫn hiện data cũ
    } = useQuery({
        // 👇 QUAN TRỌNG: Thêm currentPage vào key. Page đổi -> Key đổi -> Fetch lại
        queryKey: ["group-members", groupId, currentPage],

        queryFn: async () => {
            // Gọi API có truyền page
            const res = await getGroupMembers(groupId, {page: currentPage, size: 5});
            // 👇 Trả về cả cụm để component dùng
            return {
                items: res.data || [],
                meta: res.meta
            };
        },

        // 👇 Giữ data trang cũ hiển thị trong lúc đang tải trang mới -> UI mượt hơn hẳn
        placeholderData: keepPreviousData,

        staleTime: 1000 * 60 * 5,
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
                ["group-members", groupId, currentPage], // Nhớ đúng key có page
                (old: GroupMemberQueryResult | undefined) => {
                    if (!old) return old;
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
        <div className="space-y-4">
            {/* List Members */}
            <div
                className={isPlaceholderData ? "opacity-50" : "flex flex-col gap-y-2"}> {/* Làm mờ nhẹ khi đang load trang mới */}
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

            {/* Component Phân trang */}
            {paging && (
                <AppPagination
                    page={paging.page}
                    totalPages={paging.totalPages}
                    totalItems={paging.totalItems}
                    onPageChange={setCurrentPage} // Update state page -> Trigger useQuery
                />
            )}
        </div>
    );
}