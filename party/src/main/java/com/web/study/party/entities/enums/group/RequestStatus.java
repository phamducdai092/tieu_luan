package com.web.study.party.entities.enums.group;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RequestStatus implements EnumMeta {

    PENDING("PENDING", "Pending", "Chờ duyệt tham gia", "amber", "Clock", 10, true),
    ACCEPTED("ACCEPTED", "Approved", "Chấp nhận", "green", "CheckCircle2", 20, true),
    DECLINED("DECLINED", "Rejected", "Từ chối", "red", "CircleX", 30, true),
    CANCELED("CANCELED", "Canceled", "Yêu cầu bị hủy", "gray", "Ban", 40, true),
    EXPIRED("EXPIRED", "Expired", "Yêu cầu hết hạn", "gray", "Hourglass", 50, false);

    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}
