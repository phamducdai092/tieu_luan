package com.web.study.party.services.chat;

import com.web.study.party.config.KafkaConfig;
import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.entities.message.GroupMessages;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.chat.GroupMessageRepo;
import com.web.study.party.repositories.group.GroupRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final GroupMessageRepo groupMessageRepository;
    private final UserRepo userRepository;
    private final GroupRepo groupRepo;

    // Nhận một danh sách tin nhắn (Batch)
    @KafkaListener(
            topics = {KafkaConfig.GROUP_CHAT_TOPIC}, // Tạm thời xử lý Group Chat trước
            groupId = "${spring.kafka.consumer.group-id}"
    )
    @Transactional // Quan trọng: Đảm bảo saveAll thành công hết hoặc fail hết
    public void consumeBatch(List<ChatMessagePayload> payloads) {
        log.info("📥 Received batch of {} messages", payloads.size());

        if (payloads.isEmpty()) return;

        List<GroupMessages> entitiesToSave = new ArrayList<>();

        // 1. Convert DTO -> Entity
        for (ChatMessagePayload payload : payloads) {
            // Sử dụng getReferenceById để tránh query DB dư thừa (Lazy Load Proxy)
            Users senderProxy = userRepository.getReferenceById(Math.toIntExact(payload.sender().id()));
            StudyGroups groupProxy = groupRepo.getReferenceById(payload.targetId());

            GroupMessages entity = GroupMessages.builder()
                    .group(groupProxy)
                    .build();

            entity.setSender(senderProxy);
            entity.setContent(payload.content());
            entity.setType(payload.type());
            entity.setCreatedAt(payload.createdAt());

            entitiesToSave.add(entity);
        }

        // 2. BATCH INSERT: Lưu tất cả 50 tin nhắn chỉ với 1 lệnh DB connection
        List<GroupMessages> savedEntities = groupMessageRepository.saveAll(entitiesToSave);
        log.info("✅ Batch saved {} messages to DB", savedEntities.size());

        // 3. Broadcast WebSocket (Loop qua danh sách đã lưu để gửi về Client)
        for (int i = 0; i < savedEntities.size(); i++) {
            GroupMessages savedMsg = savedEntities.get(i);
            ChatMessagePayload originalPayload = payloads.get(i);

            // Cập nhật lại ID thật từ DB vào Payload để gửi xuống Client
            ChatMessagePayload responsePayload = new ChatMessagePayload(
                    savedMsg.getId(), // ID thật vừa sinh ra
                    originalPayload.sender(),
                    originalPayload.senderRole(),
                    originalPayload.targetId(),
                    savedMsg.getContent(),
                    savedMsg.getType(),
                    savedMsg.getCreatedAt(),
                    true
            );

            // Gửi WebSocket
            String destination = "/topic/group/" + originalPayload.targetId();
            messagingTemplate.convertAndSend(destination, responsePayload);
        }
    }
}