package com.web.study.party.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    // Tên Topic cho Group Chat
    public static final String GROUP_CHAT_TOPIC = "group-chat-topic";
    
    // Tên Topic cho Private Chat (sau này dùng)
    public static final String PRIVATE_CHAT_TOPIC = "private-chat-topic";

    @Bean
    public NewTopic groupChatTopic() {
        return TopicBuilder.name(GROUP_CHAT_TOPIC)
                .partitions(3) // Chia 3 luồng xử lý song song
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic privateChatTopic() {
        return TopicBuilder.name(PRIVATE_CHAT_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}