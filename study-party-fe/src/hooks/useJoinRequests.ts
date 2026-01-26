import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getJoinRequestsByUser } from "@/services/join_request.service";

export const joinRequestKeys = {
    all: ['join-requests'] as const,
    list: (page: number, size: number) => [...joinRequestKeys.all, 'list', page, size] as const,
};

type UseJoinRequestsOptions = {
    page?: number;
    size?: number;
    enabled?: boolean;
}

export function useJoinRequests(options: UseJoinRequestsOptions = {}) {
    const { page = 0, size = 10, enabled = true } = options;

    return useQuery({
        queryKey: joinRequestKeys.list(page, size),
        queryFn: async () => {
            // Gọi service
            const res = await getJoinRequestsByUser({ page, size });
            return {
                items: res.data || [], // Map response trả về items
                meta: res.meta         // Map response trả về meta paging
            };
        },
        placeholderData: keepPreviousData, // Giữ data cũ khi chuyển trang
        staleTime: 1000 * 60 * 2, // Cache 2 phút
        enabled: enabled,
    });
}