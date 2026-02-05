package com.web.study.party.services.account;

import com.web.study.party.dto.request.verify.*;
import com.web.study.party.repositories.user.UserRepo;
import com.web.study.party.services.mail.MailService;
import com.web.study.party.services.otp.OtpService;
import com.web.study.party.session.RefreshTokenStore;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final OtpService otp;
    private final MailService mail;
    private final RefreshTokenStore refreshStore; // để revoke all khi đổi/đặt lại mật khẩu

    // ========== VERIFY EMAIL ==========
    @Override
    @Transactional(readOnly = true)
    public void requestVerifyEmail(VerifyEmailRequest req) {
        var user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));
        if (user.isVerified()) return;

        String key = "otp:verify:" + user.getEmail();
        String code = otp.generateAndStore(key, 10 * 60);
        mail.sendOtp(user.getEmail(), "Xác thực email", code, 10 * 60);
    }

    @Override
    @Transactional
    public void confirmVerifyEmail(ConfirmVerifyEmailRequest req) {
        var user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));
        if (user.isVerified()) return;

        String key = "otp:verify:" + user.getEmail();
        boolean ok = otp.validateAndConsume(key, req.otp());
        if (!ok) throw new IllegalArgumentException("OTP không hợp lệ hoặc đã hết hạn");

        user.setVerified(true);
        user.setEmailVerifiedAt(Instant.now());
        userRepo.save(user);
    }

    // ========== FORGOT / RESET PASSWORD ==========
    @Override
    @Transactional(readOnly = true)
    public void forgotPassword(ForgotPasswordRequest req) {
        var user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));

        String key = "otp:reset:" + user.getEmail();
        String code = otp.generateAndStore(key, 10 * 60);
        mail.sendOtp(user.getEmail(), "Đặt lại mật khẩu", code, 10 * 60);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        var user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));

        String key = "otp:reset:" + user.getEmail();
        boolean ok = otp.validateAndConsume(key, req.otp());
        if (!ok) throw new IllegalArgumentException("OTP không hợp lệ hoặc đã hết hạn");

        user.setPassword(encoder.encode(req.newPassword()));
        userRepo.save(user);

        // revoke ALL refresh sessions của user
        refreshStore.deleteAllByUser(user.getId());
    }

    // ========== CHANGE PASSWORD ==========
    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));

        if (!encoder.matches(req.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }
        user.setPassword(encoder.encode(req.newPassword()));
        userRepo.save(user);

        // revoke ALL refresh sessions sau khi đổi mật khẩu
        refreshStore.deleteAllByUser(user.getId());
    }
}
