import http from "@/lib/http.ts";
import type {UserInformationResponse, UserInformationUpdatePayload, UserSearchResponse} from "@/types/user.type.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";

export const updateUserProfile = (userInformation: UserInformationUpdatePayload) => {
    return http.put("user/me", userInformation);
}

// GET /user/{userId}
export const getUserProfile = async (userId: number) => {
    const res = await http.get<ApiResponse<UserInformationResponse>>(`/user/${userId}`);
    return res.data;
}

// GET /user/search
export const searchUsers = async (
    params?: { keyword: string, page?: number; size?: number; sort?: string; }
) => {
    const res = await http.get<UserSearchResponse[]>(`/user/search`, {
        params: {
            keyword: params?.keyword,
            page: params?.page || 0,
            size: params?.size || 12,
            sort: params?.sort,
        }
    });
    return res as UnwrappedResponse<UserSearchResponse[]>;
}