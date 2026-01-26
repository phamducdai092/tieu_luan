import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getGroupMembers } from "@/services/group.member.service";

// 1. Định nghĩa Key Factory (để quản lý key cho đồng bộ, tránh gõ sai string)
export const groupKeys = {
    all: ['group-members'] as const,
    list: (groupId: number, page: number, size: number) =>
        [...groupKeys.all, groupId, page, size] as const,
};

type UseGroupMembersOptions = {
    page?: number;
    size?: number;
    enabled?: boolean; // Để control lúc nào thì fetch (ví dụ chỉ fetch khi dialog mở)
}

export function useGroupMembers(groupId: number, options: UseGroupMembersOptions = {}) {
    const { page = 0, size = 5, enabled = true } = options;

    return useQuery({
        // Dùng key factory ở trên cho chuẩn
        queryKey: groupKeys.list(groupId, page, size),

        queryFn: async () => {
            const res = await getGroupMembers(groupId, { page, size });
            return {
                items: res.data || [],
                meta: res.meta
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 phút cache
        enabled: !!groupId && enabled, // Chỉ chạy khi có groupId và enabled = true
    });
}