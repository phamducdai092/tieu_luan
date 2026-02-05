package com.web.study.party.services.auth;

import com.web.study.party.dto.TokenPair;
import com.web.study.party.dto.user.UserDTO;
import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.request.user.*;
import com.web.study.party.dto.response.TokenResponse;
import com.web.study.party.dto.response.auth.AuthResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.Role;
import com.web.study.party.exception.BadRequestException;
import com.web.study.party.exception.UnverifiedAccountException;
import com.web.study.party.jwt.JwtProperties;
import com.web.study.party.jwt.JwtService;
import com.web.study.party.repositories.user.UserRepo;
import com.web.study.party.services.mail.MailService;
import com.web.study.party.services.otp.OtpService;
import com.web.study.party.session.RefreshTokenStore;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProps;
    private final RefreshTokenStore refreshTokenStore;
    private final UserMapper userMapper;
    private final OtpService otpService;
    private final MailService mailService;

    private AuthResponse getAuthResponse(Users user) {
        var jti = jwtService.newJti();
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.issueRefreshToken(user, jti);

        long ttlSec  = Duration.of(jwtProps.getRefreshDays(), ChronoUnit.DAYS).toSeconds();
        refreshTokenStore.save(jti, user.getId(), ttlSec);

        UserDTO userDTO = userMapper.toDTO(user);

        return new AuthResponse(accessToken, refreshToken, ttlSec, userDTO);
    }

    @Transactional
    @Override
    public void register(RegisterRequest req) {

        if(userRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        String hashedPassword = passwordEncoder.encode(req.password());

        Users user = Users.builder()
                .email(req.email())
                .password(hashedPassword)
                .role(Role.USER)
                .verified(false) // Mặc định chưa xác thực
                .build();

        userRepo.save(user);

        // 👇 LOGIC GỬI OTP SAU KHI ĐĂNG KÝ
        // Key Redis: "otp:verify:abc@gmail.com"
        String otpKey = "otp:verify:" + req.email();
        // Sinh OTP 6 số, tồn tại 5 phút (300s)
        String otpCode = otpService.generateAndStore(otpKey, 300);

        // Gửi mail
        mailService.sendOtp(req.email(), "Xác thực tài khoản đăng ký", otpCode, 300);
    }

    @Override
    public AuthResponse login(LoginRequest req, String ip, String ua) {
        Users user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("Không tìm thấy người dùng với email: " + req.email()));

        if(!user.isVerified()) {
            throw new UnverifiedAccountException("Tài khoản chưa được xác thực");
        }

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException("Mật khẩu không đúng");
        }

        return getAuthResponse(user);
    }

    @Override
    public TokenResponse googleLogin(String idToken) {
        return null;
    }

    @Override
    public TokenPair refresh(String refreshToken, String ip, String ua) {
        Jws<Claims> jws = jwtService.getClaims(refreshToken);

        if(!jwtService.isRefresh(jws)) {
            throw new IllegalArgumentException("Token không phải là refresh token");
        }

        String jti = jws.getPayload().getId();

        if (!refreshTokenStore.exists(jti)) {
            throw new BadRequestException("Token đã bị thu hồi hoặc không tồn tại (đã logout)");
        }

        String email = jws.getPayload().get("email", String.class);
        Users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user với email: " + email));

        if(!refreshTokenStore.exists(jti)) {
            throw new IllegalArgumentException("Refresh token không tồn tại");
        }
        refreshTokenStore.delete(jti);

        String newJti = jwtService.newJti();
        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.issueRefreshToken(user, newJti);

        long ttlSec  = Duration.of(jwtProps.getRefreshDays(), ChronoUnit.DAYS).toSeconds();
        refreshTokenStore.save(newJti, user.getId(), ttlSec);

        return new TokenPair(newAccessToken, newRefreshToken, ttlSec);
    }

    @Override
    public void logout(String refreshToken) {
        try {
            var jws = jwtService.getClaims(refreshToken);
            if(!jwtService.isRefresh(jws)) return;
            String jti = jws.getPayload().getId();
            refreshTokenStore.delete(jti);
        } catch (Exception e) {
            // ignore
        }
    }
}
