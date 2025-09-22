package com.web.study.party.dto.mapper.group;

import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.repositories.projection.GroupCardProjection;

public class GroupCardMapper {
    public static GroupCardResponse toDto(GroupCardProjection p) {
        return GroupCardResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .topic(p.getTopic())
                .topicColor(p.getTopicColor())
                .maxMembers(p.getMaxMembers())
                .memberCount(p.getMemberCount())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
