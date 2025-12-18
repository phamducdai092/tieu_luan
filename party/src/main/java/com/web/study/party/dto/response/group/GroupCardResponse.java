package com.web.study.party.dto.response.group;

import java.time.Instant;

public record GroupCardResponse(
        Long id,
        String name,
        String slug,
        String topic,
        String topicColor,
        Integer maxMembers,
        Integer memberCount,
        Instant updatedAt
) {
}
