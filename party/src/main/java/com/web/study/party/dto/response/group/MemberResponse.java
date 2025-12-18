package com.web.study.party.dto.response.group;

import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.MemberRole;

public record MemberResponse(
        UserBrief member,
        MemberRole role
) {
}