package com.web.study.party.dto.response.user;

import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.dto.response.group.JoinRequestResponse;

public record UserJoinRequestResponse(
        JoinRequestResponse joinRequestResponse,
        GroupResponse groupResponse
) {
}
