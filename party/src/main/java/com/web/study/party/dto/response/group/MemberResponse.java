package com.web.study.party.dto.response.group;

import com.web.study.party.entities.enums.MemberRole;
import com.web.study.party.entities.enums.MemberState;

import java.time.Instant;

public record MemberResponse(
        Long userId,
        String displayName,
        String avatarUrl,
        MemberRole role,
        MemberState state,
        Instant joinedAt
) {
}