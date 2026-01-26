import http from "@/lib/http";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type";
import type {
    AdminDashboardResponse,
    AdminFileResponse,
    AdminGroupsResponse,
    AdminUsersResponse
} from "@/types/admin/admin.type";
import type {AdminQueryParams} from "@/types/admin/admin.type";

export const adminService = {
    // 1. GET /admin/dashboard
    getDashboardStats: async () => {
        const res = await http.get<ApiResponse<AdminDashboardResponse>>("admin/dashboard");
        return res.data;
    },

    // 2. GET /admin/users
    getUsers: async (params?: AdminQueryParams) => {
        const res = await http.get<AdminUsersResponse[]>("admin/users", {
            params: {
                keyword: params?.keyword || "",
                page: params?.page || 0,
                size: params?.size || 10,
                sortBy: params?.sortBy || "id",
                order: params?.order || "desc"
            }
        });
        return res as UnwrappedResponse<AdminUsersResponse[]>;
    },

    // 3. GET /admin/groups
    getGroups: async (params?: AdminQueryParams) => {
        const res = await http.get<AdminGroupsResponse[]>("admin/groups", {
            params: {
                keyword: params?.keyword || "",
                page: params?.page || 0,
                size: params?.size || 10,
                sortBy: params?.sortBy || "id",
                order: params?.order || "desc"
            }
        });
        return res as UnwrappedResponse<AdminGroupsResponse[]>;
    },

    // 4. PUT /admin/users/{userId}/status
    toggleUserStatus: async (userId: number) => {
        const res = await http.put<ApiResponse<void>>(`admin/users/${userId}/status`);
        return res.data;
    },

    // 5. PUT /admin/groups/{groupId}/status
    toggleGroupStatus: async (groupId: number) => {
        const res = await http.put<ApiResponse<void>>(`admin/groups/${groupId}/status`);
        return res.data;
    },

    // 6. GET /admin/files
    getAllFiles: async (params?: AdminQueryParams) => {
        const res = await http.get<AdminFileResponse[]>("admin/files", {
            params: {
                keyword: params?.keyword || "",
                page: params?.page || 0,
                size: params?.size || 10,
                sortBy: params?.sortBy || "id",
                order: params?.order || "desc"
            }
        });
        return res as UnwrappedResponse<AdminFileResponse[]>;
    }
};