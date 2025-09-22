package com.web.study.party.dto.response.group;

import com.web.study.party.entities.enums.GroupTopic;

import java.time.Instant;

public record GroupResponse(
        Long id,
        String name,
        String slug,
        String description,
        GroupTopic topic,
        String topicColor,
        Integer maxMembers,
        Integer memberCount,
        Long ownerId,
        Instant createdAt
) {
}