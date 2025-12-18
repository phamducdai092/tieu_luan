package com.web.study.party.dto.response.group;

import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.RequestStatus;
import java.time.Instant;

public record JoinRequestResponse(
        Long requestId,
        Long groupId,
        RequestStatus status,
        Instant createdAt,
        UserBrief resolver,
        UserBrief user,
        UserBrief owner
) {
}