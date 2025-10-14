package com.web.study.party.dto.response.group;

import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.RequestStatus;
import lombok.Data;

import java.time.Instant;

@Data
public class InvitationResponse {
    private Long id;
    private UserBrief inviter;
    private UserBrief invitee;
    private RequestStatus status;
    private Instant createdAt;
    private Instant expiresAt;
}