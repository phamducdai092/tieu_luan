package com.web.study.party.dto.response.group;

import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.MemberRole;

import java.time.Instant;

public record MemberResponse(
        UserBrief member,
        Instant joinedAt,
        MemberRole role
) {
}