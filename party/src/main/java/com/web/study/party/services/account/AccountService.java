package com.web.study.party.services.account;


import com.web.study.party.dto.request.verify.*;

public interface AccountService {

    void requestVerifyEmail(VerifyEmailRequest req);
    void confirmVerifyEmail(ConfirmVerifyEmailRequest req);

    void forgotPassword(ForgotPasswordRequest req);
    void resetPassword(ResetPasswordRequest req);

    void changePassword(String email, ChangePasswordRequest req);
}
