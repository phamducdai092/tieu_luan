package com.web.study.party.socket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessage {
    private String type; // Loại tin nhắn: "ROOM_UPDATED", "NEW_MESSAGE",...
    private Object payload; // Dữ liệu kèm theo (ví dụ: tên mới của phòng)
}