package com.web.study.party.dto.response.auth;

import com.web.study.party.dto.user.UserDTO;

public record AuthResponse(String accessToken, String refreshToken, Long refreshTtlSeconds, UserDTO user) {}