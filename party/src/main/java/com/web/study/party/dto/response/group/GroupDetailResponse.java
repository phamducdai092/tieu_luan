package com.web.study.party.dto.response.group;

import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.GroupPrivacy;
import com.web.study.party.entities.enums.group.GroupTopic;
import com.web.study.party.entities.enums.group.JoinPolicy;
import com.web.study.party.entities.enums.group.MemberRole;

public record GroupDetailResponse(
        Long id,
        String name,
        String slug,
        String description,
        GroupTopic topic,
        String topicColor,
        Integer maxMembers,
        Integer memberCount,
        GroupPrivacy groupPrivacy,
        JoinPolicy joinPolicy,

        UserBrief owner,

        MemberRole currentUserRole
) {
}