package com.web.study.party.dto.response.group;

import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.RequestStatus;
import lombok.Data;
import java.time.Instant;

@Data
public class JoinRequestResponse {
    private Long id;
    private UserBrief user;
    private RequestStatus status;
    private Instant createdAt;

}