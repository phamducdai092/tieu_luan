package com.web.study.party.entities.enums.group;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MemberState implements EnumMeta {
    PENDING("PENDING", "Pending", "Chờ duyệt tham gia", "amber", "Clock", 10, true),
    APPROVED("APPROVED", "Approved", "Đã được duyệt", "green", "CheckCircle2", 20, true),
    REJECTED("REJECTED", "Rejected", "Bị từ chối", "red", "CircleX", 30, true),
    BANNED("BANNED", "Banned", "Bị cấm khỏi nhóm", "rose", "OctagonAlert", 40, true),
    LEFT("LEFT", "Left", "Rời khỏi nhóm", "gray", "Exit", 50, true),
    KICKED("KICKED", "Kicked", "Bị buộc rời khỏi nhóm", "gray", "UserMinus", 60, true);
    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}
