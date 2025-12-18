package com.web.study.party.services.chat;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.request.chat.SendMessageRequest;
import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.message.GroupMessages;
import com.web.study.party.exeption.ResourceNotFoundException;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.chat.GroupMessageRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.utils.socket.SocketConst;
import com.web.study.party.utils.socket.SocketNotify;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;


@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final GroupRepo groupRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final GroupMessageRepo groupMessageRepo;
    private final ChatProducer chatProducer; // Interface bắn Kafka
    private final UserMapper userMapper;

    @Override
    public Page<ChatMessagePayload> getGroupChatMessages(Long groupId, Pageable pageable) {
        Page<GroupMessages> messages = groupMessageRepo.findByGroupIdOrderByCreatedAtAsc(groupId, pageable);

        return messages.map(msg -> {
            GroupMembers member = groupMemberRepo.findByGroupIdAndUserId(groupId, msg.getSender().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Group member not found"));
            UserBrief senderBrief = userMapper.toUserBrief(member.getUser());

            return new ChatMessagePayload(
                    msg.getId(),
                    senderBrief,
                    member.getRole(),
                    groupId,
                    msg.getContent(),
                    msg.getType(),
                    msg.getCreatedAt(),
                    true // isGroup
            );
        });
    }

    @Override
    @Transactional(readOnly = true)
    @SocketNotify(
            topic = "'" + SocketConst.PREFIX_TOPIC_CHAT_ROOM + "' + #result.targetId",
            type = SocketConst.EVENT_NEW_GROUP_MESSAGE
    )
    public ChatMessagePayload sendGroupMessage(Long senderId, Long groupId, SendMessageRequest req) {
        // 1. Validate: Nhóm có tồn tại k?
        groupRepo.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        // 2. Validate: User có phải thành viên k? (Quan trọng)
        GroupMembers member = groupMemberRepo.findByGroupIdAndUserId(groupId, senderId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this group"));

        UserBrief senderBrief = userMapper.toUserBrief(member.getUser());

        ChatMessagePayload payload = new ChatMessagePayload(
                null, // ID chưa có
                senderBrief,
                member.getRole(),
                groupId,
                req.content(),
                req.type(),
                Instant.now(),
                true // isGroup
        );

        // 3. Bắn sang Kafka (Fire & Forget)
        chatProducer.sendMessage(payload);

        return payload;
    }
}