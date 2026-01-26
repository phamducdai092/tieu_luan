package com.web.study.party.dto.response.admin;

import com.web.study.party.entities.enums.AccountStatus;
import com.web.study.party.entities.enums.Role;

import java.time.Instant;

public record AdminUserResponse(
        Long id,
        String email,
        String avatarUrl,
        String bannerUrl,
        String displayName,
        String bio,
        String phoneNumber,
        Instant dateOfBirth,
        Instant emailVerifiedAt,
        Role role,
        AccountStatus accountStatus
) {
}
