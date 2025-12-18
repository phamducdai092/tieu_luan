package com.web.study.party.api.chat;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.dto.request.chat.SendMessageRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.PageMeta;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.chat.ChatService;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<ChatMessagePayload>>> getGroupChatMessage(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest
    ) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        PageMeta meta = PageMeta.builder()
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .build();
        List<ChatMessagePayload> dummyPayload = chatService.getGroupChatMessages(groupId, pageable).getContent();

        return ResponseUtil.page(dummyPayload, meta, "Fetched group chat messages", httpRequest);
    }

    @PostMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<Void>> sendGroupMessage(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long groupId,
            @RequestBody @Valid SendMessageRequest request,
            HttpServletRequest httpRequest
    ) {
        Long senderId = user.getId();

        chatService.sendGroupMessage(senderId, groupId, request);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getCode())
                .path(httpRequest.getRequestURI())
                .data(null)
                .message("Message sent")
                .build();

        return ResponseEntity.ok(response);
    }
}