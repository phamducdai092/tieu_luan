package com.web.study.party.entities.enums.group;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MemberRole implements EnumMeta {
    OWNER("OWNER", "Owner", "Chủ phòng/nhóm", "violet", "Crown", 10, true),
    MOD("MOD", "Moderator", "Quản trị viên", "blue", "Shield", 20, true),
    MEMBER("MEMBER", "Member", "Thành viên", "zinc", "User", 30, true),
    GUEST("GUEST", "Guest", "Khách mời", "gray", "UserCircle", 40, false);

    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}
