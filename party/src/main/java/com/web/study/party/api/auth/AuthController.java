package com.web.study.party.api.auth;

import com.web.study.party.dto.request.user.LoginRequest;
import com.web.study.party.dto.request.user.RegisterRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.TokenResponse;
import com.web.study.party.dto.response.auth.AuthResponse;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.jwt.JwtProperties;
import com.web.study.party.services.auth.AuthService;
import com.web.study.party.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProperties jwtProps;
    private AuthResponse authResponse;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req, HttpServletRequest httpRequest) {
        authResponse = authService.register(req);

        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .status(CodeStatus.SUCCESS.getCode())
                .code("SUCCESS")
                .data(authResponse)
                .path(httpRequest.getRequestURI())
                .message("Đã đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.")
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req,  HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        String ua = httpRequest.getHeader("User-Agent");

        var pair = authService.login(req, ip, ua);
        var cookie = CookieUtils.buildRefreshCookie(jwtProps, pair.refreshToken(), pair.refreshTtlSeconds());

        authResponse = pair;

        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .status(CodeStatus.SUCCESS.getCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .data(authResponse)
                .message("Đăng nhập thành công")
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(@CookieValue(name = "${security.jwt.refresh-cookie-name:refresh_token}", required = false) String refreshCookie,
                                                                                                                                                                HttpServletRequest httpRequest) {

        if (refreshCookie == null || refreshCookie.isBlank()) {
            // 401 để FE biết cần login lại
            return ResponseEntity.status(401).build();
        }

        String ip = httpRequest.getRemoteAddr();
        String ua = httpRequest.getHeader("User-Agent");

        var pair = authService.refresh(refreshCookie, ip, ua);
        var cookie = CookieUtils.buildRefreshCookie(jwtProps, pair.refreshToken(), pair.refreshTtlSeconds());

        TokenResponse tokenResponse = new TokenResponse(pair.accessToken());

        ApiResponse<TokenResponse> response = ApiResponse.<TokenResponse>builder()
                .status(CodeStatus.SUCCESS.getCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .data(tokenResponse)
                .message("Làm mới token thành công")
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@CookieValue(name = "${app.jwt.refresh-cookie-name:refresh_token}", required = false) String refreshCookie, HttpServletRequest httpRequest) {

        if (refreshCookie != null && !refreshCookie.isBlank()) {
            authService.logout(refreshCookie); // revoke trong Redis
        }

        var clear = CookieUtils.clearRefreshCookie(jwtProps);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .message("Đăng xuất thành công")
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", clear.toString())
                .body(response);

    }
}