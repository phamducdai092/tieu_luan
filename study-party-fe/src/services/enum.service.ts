import http from "@/lib/http";
import type { ApiResponse } from "@/types/api.type.ts";
import type { EnumGroup } from "@/types/enum.type.ts";

// Lấy theo danh sách tên enum: /enums?names=AccountStatus,MemberRole,...
export const getEnumsByNames = async (names?: string[]) => {
    const res = await http.get<ApiResponse<EnumGroup[]>>(
        "enums",
        { params: { names: names?.join(",") } }
    );
    return res.data; // bóc mảng EnumGroup[]
};

// Hoặc lấy mặc định tất cả (BE tự quyết)
export const getAllEnums = async () => {
    const res = await http.get<ApiResponse<EnumGroup[]>>("enums");
    // const api = pickApiPayload<EnumGroup[]>(res);
    return res.data;
};
