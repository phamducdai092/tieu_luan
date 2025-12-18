package com.web.study.party.dto.response.notification;

import com.web.study.party.dto.response.user.UserBrief;
import java.time.Instant;

public record NotificationResponse(
        Long id,
        String content,
        String link,
        String type,
        boolean isRead,
        Instant createdAt,
        UserBrief recipient
) {}