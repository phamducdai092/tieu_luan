package com.web.study.party.services.chat;

import com.web.study.party.config.KafkaConfig;
import com.web.study.party.dto.kafka.ChatMessagePayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatProducer {

    // Key là String, Value là ChatMessagePayload (nhớ config Serializer trong application.yml)
    private final KafkaTemplate<String, ChatMessagePayload> kafkaTemplate;

    public void sendMessage(ChatMessagePayload message) {
        String topic;
        String key;

        if (message.isGroup()) {
            topic = KafkaConfig.GROUP_CHAT_TOPIC;
            // Key = GroupID để đảm bảo thứ tự tin nhắn trong nhóm
            key = "GROUP_" + message.targetId();
        } else {
            topic = KafkaConfig.PRIVATE_CHAT_TOPIC;
            // Key cần đảm bảo 2 người chat với nhau luôn rơi vào 1 partition
            // (Sẽ xử lý logic tạo key private ở service gọi vào hoặc ở đây)
            key = "USER_" + message.targetId();
        }

        log.info("📤 Sending message to Kafka topic: {}, key: {}", topic, key);

        kafkaTemplate.send(topic, key, message);
    }
}