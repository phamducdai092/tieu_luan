package com.web.study.party.services.chat;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.dto.pagination.CursorResponse;
import com.web.study.party.dto.request.chat.SendMessageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface ChatService {
    CursorResponse<ChatMessagePayload> getGroupChatMessages(Long groupId, Long cursorId, int limit);
    ChatMessagePayload sendGroupMessage(Long senderId, Long groupId, SendMessageRequest req, List<MultipartFile> files);
}
