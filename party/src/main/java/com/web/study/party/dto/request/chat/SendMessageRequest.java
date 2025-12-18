package com.web.study.party.dto.request.chat;

import com.web.study.party.entities.enums.group.MessageType;

public record SendMessageRequest(
    String content,
    MessageType type
) {}