import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import type {AdminQueryParams} from "@/types/admin/admin.type.ts";

// 1. Định nghĩa Key Factory
export const adminKeys = {
    all: ['admin-users'] as const,
    list: (params: AdminQueryParams) => [...adminKeys.all, params] as const,
};

// 2. Hook chính
export function useAdminUsers(params: AdminQueryParams, enabled: boolean = true) {
    return useQuery({
        // Key phụ thuộc vào toàn bộ params (keyword, page, size...)
        // Khi params thay đổi -> Tự động fetch lại
        queryKey: adminKeys.list(params),

        queryFn: async () => {
            const res = await adminService.getUsers(params);
            return {
                // Đảm bảo luôn trả về mảng để không lỗi map
                items: res.data || [],
                meta: res.meta // Chứa thông tin page, totalPages
            };
        },

        // Giữ dữ liệu cũ hiển thị trong lúc đang fetch trang mới (tránh nháy màn hình)
        placeholderData: keepPreviousData,

        // Cache 5 phút
        staleTime: 1000 * 60 * 5,

        // Control việc fetch (ví dụ chưa muốn fetch ngay)
        enabled: enabled
    });
}