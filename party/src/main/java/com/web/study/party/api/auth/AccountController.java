package com.web.study.party.api.auth;

import com.web.study.party.dto.request.verify.*;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.account.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

//    @GetMapping("{userId}")
//    public z

    @PostMapping("/verify-email/request")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody VerifyEmailRequest req, HttpServletRequest httpRequest) {
        accountService.requestVerifyEmail(req);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .path(httpRequest.getRequestURI())
                .message("Vui lòng kiểm tra email để lấy mã OTP xác thực tài khoản.")
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-email/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmVerifyEmail(@Valid @RequestBody ConfirmVerifyEmailRequest req, HttpServletRequest httpRequest) {
        accountService.confirmVerifyEmail(req);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .path(httpRequest.getRequestURI())
                .message("Xác thực email thành công.")
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req, HttpServletRequest httpRequest) {
        accountService.forgotPassword(req);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .path(httpRequest.getRequestURI())
                .message("Vui lòng kiểm tra email để lấy mã OTP đặt lại mật khẩu.")
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest req, HttpServletRequest httpRequest) {
        accountService.resetPassword(req);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .path(httpRequest.getRequestURI())
                .message("Đặt lại mật khẩu thành công.")
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest req, Authentication auth, HttpServletRequest httpRequest) {
        String email = auth.getName();
        accountService.changePassword(email, req);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .path(httpRequest.getRequestURI())
                .message("Đổi mật khẩu thành công.")
                .build();
        return ResponseEntity.ok(response);
    }
}
