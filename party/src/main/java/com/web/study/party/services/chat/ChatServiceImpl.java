package com.web.study.party.services.chat;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.dto.mapper.group.task.AttachmentMapper;
import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.request.chat.SendMessageRequest;
import com.web.study.party.dto.response.group.task.AttachmentResponse;
import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.message.GroupMessages;
import com.web.study.party.exception.ResourceNotFoundException;
import com.web.study.party.repositories.chat.GroupMessageRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.services.fileStorage.FileStorageService;
import com.web.study.party.utils.Helper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final GroupRepo groupRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final GroupMessageRepo groupMessageRepo;

    private final ChatProducer chatProducer;
    private final FileStorageService fileStorageService;

    private final UserMapper userMapper;
    private final AttachmentMapper attachmentMapper;

    @Override
    public Page<ChatMessagePayload> getGroupChatMessages(Long groupId, Pageable pageable) {
        // Query tin nhắn (JPA sẽ tự lazy load attachments khi gọi getAttachments)
        Page<GroupMessages> messages = groupMessageRepo.findByGroupIdOrderByCreatedAtDesc(groupId, pageable);

        return messages.map(msg -> {
            GroupMembers member = groupMemberRepo.findByGroupIdAndUserId(groupId, msg.getSender().getId())
                    .orElse(null); // Handle null cho an toàn

            UserBrief senderBrief = (member != null)
                    ? userMapper.toUserBrief(member.getUser())
                    : userMapper.toUserBrief(msg.getSender());

            // Map Entity Attachments -> DTO Response
            List<AttachmentResponse> attResponses = new ArrayList<>();
            if (msg.getAttachments() != null) {
                attResponses = msg.getAttachments().stream()
                        .map(attachmentMapper::toResponse).toList();
            }

            return new ChatMessagePayload(
                    msg.getId(),
                    senderBrief,
                    (member != null) ? member.getRole() : null,
                    groupId,
                    msg.getContent(),
                    msg.getType(),
                    msg.getCreatedAt(),
                    true,
                    attResponses // 👇 Trả về list file kèm tin nhắn cũ
            );
        });
    }

    @Override
    @Transactional
    public ChatMessagePayload sendGroupMessage(Long senderId, Long groupId, SendMessageRequest req, List<MultipartFile> files) {

        // ... (Logic Validate Group & Member giữ nguyên) ...
        groupRepo.findById(groupId).orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        GroupMembers member = groupMemberRepo.findByGroupIdAndUserId(groupId, senderId)
                .orElseThrow(() -> new AccessDeniedException("Not a member"));
        UserBrief senderBrief = userMapper.toUserBrief(member.getUser());

        // --- XỬ LÝ FILE ---
        List<AttachmentResponse> attachmentPayloads = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile f : files) {
                // Upload file (Lưu vào folder chat/group/...)
                String folder = "chat/groups/" + groupId;
                String fileUrl = fileStorageService.uploadFile(f, folder);

                // Tạo DTO Attachment (ID null vì chưa lưu DB)
                // Lưu ý: Constructor AttachmentResponse phải khớp
                attachmentPayloads.add(
                        new AttachmentResponse(
                                null,
                                f.getOriginalFilename(),
                                fileUrl,
                                Helper.getExtension(f.getOriginalFilename()),
                                f.getSize(),
                                Instant.now(),
                                senderBrief.id()
                        ));
            }
        }

        // --- TẠO PAYLOAD ---
        ChatMessagePayload payload = new ChatMessagePayload(
                null,
                senderBrief,
                member.getRole(),
                groupId,
                req.content(),
                req.type(),
                Instant.now(),
                true,
                attachmentPayloads // 👇 Nhét list file đã upload vào payload
        );

        // --- BẮN KAFKA ---
        chatProducer.sendMessage(payload);

        return payload;
    }
}