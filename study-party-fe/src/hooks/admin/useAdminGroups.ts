import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import type {AdminQueryParams} from "@/types/admin/admin.type.ts";

// Key Factory cho Group
export const adminGroupKeys = {
    all: ['admin-groups'] as const,
    list: (params: AdminQueryParams) => [...adminGroupKeys.all, params] as const,
};

export function useAdminGroups(params: AdminQueryParams) {
    return useQuery({
        queryKey: adminGroupKeys.list(params),
        queryFn: async () => {
            const res = await adminService.getGroups(params);
            return {
                items: res.data || [],
                meta: res.meta // { page, size, totalPages, totalElements }
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });
}