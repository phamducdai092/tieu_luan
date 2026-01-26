import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import type {AdminQueryParams} from "@/types/admin/admin.type.ts";

// Key Factory cho Files
export const adminFileKeys = {
    all: ['admin-files'] as const,
    list: (params: AdminQueryParams) => [...adminFileKeys.all, params] as const,
};

export function useAdminFiles(params: AdminQueryParams) {
    return useQuery({
        queryKey: adminFileKeys.list(params),
        queryFn: async () => {
            const res = await adminService.getAllFiles(params);
            return {
                items: res.data || [],
                meta: res.meta // { page, size, totalPages, totalElements }
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });
}