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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProperties jwtProps;
    private AuthResponse authResponse;

    @Value("${security.jwt.refresh-cookie-name:refresh_token}")
    private String refreshCookieName;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req, HttpServletRequest httpRequest) {
        authResponse = authService.register(req);

        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(authResponse)
                .path(httpRequest.getRequestURI())
                .message("Đã đăng ký thành công. Vui lòng kiểm tra email để nhận mã xác thực tài khoản.")
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        String ua = httpRequest.getHeader("User-Agent");

        var pair = authService.login(req, ip, ua);
        var cookie = CookieUtils.buildRefreshCookie(jwtProps, pair.refreshToken(), pair.refreshTtlSeconds());

        authResponse = pair;

        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
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
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(HttpServletRequest httpRequest) {

        var cookie = WebUtils.getCookie(httpRequest, refreshCookieName);
        if (cookie == null || cookie.getValue() == null || cookie.getValue().isBlank()) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.<TokenResponse>builder()
                            .status(401)
                            .code("UNAUTHORIZED")
                            .path(httpRequest.getRequestURI())
                            .message("Missing refresh token")
                            .build());
        }

        String refresh = cookie.getValue().trim();

        // JWT phải có đúng 2 dấu '.'
        long dotCount = refresh.chars().filter(ch -> ch == '.').count();
        if (dotCount != 2) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.<TokenResponse>builder()
                            .status(401)
                            .code("UNAUTHORIZED")
                            .path(httpRequest.getRequestURI())
                            .message("Invalid refresh token format")
                            .build());
        }

        String ip = httpRequest.getRemoteAddr();
        String ua = httpRequest.getHeader("User-Agent");

        try {
            var pair = authService.refresh(refresh, ip, ua);

            ResponseCookie newCookie = CookieUtils.buildRefreshCookie(jwtProps, pair.refreshToken(), pair.refreshTtlSeconds());

            var body = ApiResponse.<TokenResponse>builder()
                    .status(CodeStatus.SUCCESS.getHttpCode())
                    .code("SUCCESS")
                    .path(httpRequest.getRequestURI())
                    .data(new TokenResponse(pair.accessToken()))
                    .message("Làm mới token thành công")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, newCookie.toString())
                    .body(body);

        } catch (Exception ex) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.<TokenResponse>builder()
                            .status(401)
                            .code("UNAUTHORIZED")
                            .path(httpRequest.getRequestURI())
                            .message("Invalid or expired refresh token")
                            .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@CookieValue(name = "${app.jwt.refresh-cookie-name:refresh_token}", required = false) String refreshCookie, HttpServletRequest httpRequest) {

        if (refreshCookie != null && !refreshCookie.isBlank()) {
            authService.logout(refreshCookie); // revoke trong Redis
        }

        var clear = CookieUtils.clearRefreshCookie(jwtProps);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .message("Đăng xuất thành công")
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", clear.toString())
                .body(response);

    }
}