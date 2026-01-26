package com.web.study.party.dto.response.group.task;

import lombok.Builder;
import java.time.Instant;

@Builder
public record AssigneeResponse(
    Long userId,
    String userName,
    String userAvatar,
    String email,
    Instant assignedAt
) {}