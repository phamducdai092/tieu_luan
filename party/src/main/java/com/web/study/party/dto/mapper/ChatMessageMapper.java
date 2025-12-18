package com.web.study.party.dto.mapper;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.entities.message.GroupMessages;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ChatMessageMapper {
    @Mapping(target = "messageId", source = "id")
    @Mapping(target = "targetId", source = "group.id")
    ChatMessagePayload groupMessageToChatMessagePayload(GroupMessages gm);
}
