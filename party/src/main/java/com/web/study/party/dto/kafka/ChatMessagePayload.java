package com.web.study.party.dto.kafka;

import com.web.study.party.dto.response.group.task.AttachmentResponse;
import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.MessageType;
import java.time.Instant;
import java.util.List;

public record ChatMessagePayload(
        Long messageId,       // ID tin nhắn trong DB (quan trọng để sắp xếp/reply)
        UserBrief sender,      // Thông tin người gửi
        MemberRole senderRole, // Vai trò người gửi trong nhóm (nếu là nhóm)
        Long targetId,        // GroupId hoặc ReceiverId
        String content,
        MessageType type,
        Instant createdAt,
        boolean isGroup,       // Cờ đánh dấu để Consumer biết đường routing
        List<AttachmentResponse> attachments
) {}