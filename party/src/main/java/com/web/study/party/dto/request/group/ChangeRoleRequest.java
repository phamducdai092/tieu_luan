package com.web.study.party.dto.request.group;

import com.web.study.party.entities.enums.group.MemberRole;

public record ChangeRoleRequest(
        MemberRole newMemberRole
) {
}
