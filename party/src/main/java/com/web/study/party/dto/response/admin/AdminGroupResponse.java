package com.web.study.party.dto.response.admin;

import com.web.study.party.entities.enums.group.GroupTopic;

import java.time.Instant;

public record AdminGroupResponse(
        Long id,
        String name,
        String slug,
        String description,
        GroupTopic topic,
        String topicColor,
        Integer maxMembers,
        Long memberCount,
        Long ownerId,
        Instant createdAt,
        Boolean active,
        Boolean deleted
) {
}
