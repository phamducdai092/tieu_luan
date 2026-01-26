import http from "@/lib/http.ts";
import type { ApiResponse } from "@/types/api.type.ts";
// 👇 Nhớ bổ sung các type này vào file type tương ứng nhé
import type {
    ConfirmVerifyEmailRequest,
    VerifyEmailRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest
} from "@/types/account/account.type.ts";

export const accountService = {
    // 1. Gửi yêu cầu xác thực email (POST /account/verify-email/request)
    verifyEmail: async (request: VerifyEmailRequest) => {
        const res = await http.post<ApiResponse<void>>("account/verify-email/request", request);
        return res.data;
    },

    // 2. Xác nhận email bằng mã OTP (POST /account/verify-email/confirm)
    confirmVerifyEmail: async (request: ConfirmVerifyEmailRequest) => {
        const res = await http.post<ApiResponse<void>>("account/verify-email/confirm", request);
        return res.data;
    },

    // 3. Quên mật khẩu - Gửi OTP (POST /account/forgot-password)
    forgotPassword: async (request: ForgotPasswordRequest) => {
        const res = await http.post<ApiResponse<void>>("account/forgot-password", request);
        return res.data;
    },

    // 4. Đặt lại mật khẩu mới (POST /account/reset-password)
    resetPassword: async (request: ResetPasswordRequest) => {
        const res = await http.post<ApiResponse<void>>("account/reset-password", request);
        return res.data;
    },

    // 5. Đổi mật khẩu (PUT /account/change-password)
    changePassword: async (request: ChangePasswordRequest) => {
        const res = await http.put<ApiResponse<void>>("account/change-password", request);
        return res.data;
    }
};