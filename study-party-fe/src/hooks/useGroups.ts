import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {getRoomsDiscover, getRoomsUserJoined, getRoomsUserOwned} from "@/services/group.service";

// 1. Định nghĩa Type
export type GroupListType = 'joined' | 'owned' | 'discover';

// 2. Key Factory (Quản lý Cache Key)
export const groupListKeys = {
    all: ['groups-list'] as const,
    joined: (page: number, size: number) => [...groupListKeys.all, 'joined', page, size] as const,
    owned: (page: number, size: number) => [...groupListKeys.all, 'owned', page, size] as const,
    discover: (page: number, size: number) => [...groupListKeys.all, 'discover', page, size] as const,
};

type UseGroupsOptions = {
    type: GroupListType;
    page?: number;
    size?: number;
    enabled?: boolean;
}

export function useGroups({ type, page = 0, size = 12, enabled = true }: UseGroupsOptions) {

    const queryKey = {
        joined: groupListKeys.joined(page, size),
        owned: groupListKeys.owned(page, size),
        discover: groupListKeys.discover(page, size),
    }[type];

    const apiCall = {
        joined: getRoomsUserJoined,
        owned: getRoomsUserOwned,
        discover: getRoomsDiscover,
    }[type];

    return useQuery({
        // Sử dụng key đã map ở trên
        queryKey: queryKey,

        queryFn: async () => {
            // Gọi API đã map ở trên
            const res = await apiCall({ page, size, sort: 'createdAt' });

            return {
                items: res.data || [],
                meta: res.meta
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 phút
        enabled: enabled,
    });
}