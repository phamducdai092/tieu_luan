package com.web.study.party.entities.enums.group;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MessageType implements EnumMeta {
    TEXT("TEXT", "Text", "Văn bản thông thường", "blue", "MessageCircle", 10, true),       // Tin nhắn thường
    IMAGE("IMAGE", "Image", "Hình ảnh", "amber", "FileImage", 20, true),      // Gửi ảnh
    FILE("FILE", "File", "Tài liệu", "gray", "File", 30, true), // Gửi tài liệu
    SYSTEM("SYSTEM", "System", "Thông báo hệ thống", "violet", "Server", 40, true),     // Thông báo hệ thống (VD: "Trưởng nhóm đã đổi tên nhóm")
    REPLY("REPLY", "Reply", "Trả lởi tin nhắn", "zinc", "MessageCircleReply", 50, true),      // Trả lời tin nhắn khác
    VIDEO_CALL("VIDEO_CALL", "Video Call", "Cuộc gọi video", "green", "Video", 60, true); // Thông báo cuộc gọi video (VD: "User A đang gọi video...")
    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}