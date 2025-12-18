package com.web.study.party.services.chat;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.dto.request.chat.SendMessageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface ChatService {
    Page<ChatMessagePayload> getGroupChatMessages(Long groupId, Pageable pageable);
    ChatMessagePayload sendGroupMessage(Long senderId, Long groupId, SendMessageRequest req);
}
