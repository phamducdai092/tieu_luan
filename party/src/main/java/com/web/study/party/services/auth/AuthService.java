package com.web.study.party.services.auth;

import com.web.study.party.dto.TokenPair;
import com.web.study.party.dto.request.user.*;
import com.web.study.party.dto.response.TokenResponse;
import com.web.study.party.dto.response.auth.AuthResponse;

public interface AuthService {
    void register(RegisterRequest req);
    AuthResponse login(LoginRequest req, String ip, String ua);
    TokenResponse googleLogin(String idToken);
    TokenPair refresh(String refreshToken, String ip, String ua);
    void logout(String refreshToken);
}
