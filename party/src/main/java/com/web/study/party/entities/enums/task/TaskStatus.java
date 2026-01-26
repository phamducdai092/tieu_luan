package com.web.study.party.entities.enums.task;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TaskStatus implements EnumMeta {
    ASSIGNED(
        "ASSIGNED", 
        "Đã giao", 
        "Bài tập đang chờ thực hiện", 
        "gray",           // Màu trung tính
        "ClipboardList",  // Icon danh sách
        10, 
        true
    ),
    SUBMITTED(
        "SUBMITTED", 
        "Đã nộp", 
        "Đang chờ trưởng nhóm/mod xem xét", 
        "blue",           // Màu thông tin
        "Send",           // Icon máy bay giấy/gửi
        20, 
        true
    ),
    REQUEST_CHANGE(
        "REQUEST_CHANGE", 
        "Cần sửa lại", 
        "Bài nộp chưa đạt yêu cầu, cần làm lại", 
        "orange",         // Màu cảnh báo
        "AlertCircle",    // Icon chấm than
        30, 
        true
    ),
    APPROVED(
        "APPROVED", 
        "Đã duyệt", 
        "Bài tập đã hoàn thành xuất sắc", 
        "green",          // Màu thành công
        "CheckCircle",    // Icon tích xanh
        40, 
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