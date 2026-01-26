package com.web.study.party.entities.enums.task;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SubmissionType implements EnumMeta {
    INDIVIDUAL(
        "INDIVIDUAL", 
        "Cá nhân", 
        "Mỗi thành viên nộp bài riêng biệt", 
        "blue",        // Màu xanh dương: đại diện cho user
        "User",        // Icon hình người
        1, 
        true
    ),
    GROUP(
        "GROUP", 
        "Nhóm", 
        "Đại diện nhóm nộp bài", 
        "purple",      // Màu tím: đại diện cho team/nhóm
        "Users",       // Icon nhiều người
        2, 
        true
    );

    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}