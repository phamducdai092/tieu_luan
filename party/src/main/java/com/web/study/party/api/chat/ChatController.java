package com.web.study.party.api.chat;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.request.chat.SendMessageRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.page.PageMeta;
import com.web.study.party.dto.response.call.VideoCallResponse;
import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.call.AgoraService;
import com.web.study.party.services.chat.ChatProducer;
import com.web.study.party.services.chat.ChatService;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ChatProducer chatProducer;
    private final AgoraService agoraService;
    private final UserMapper userMapper;

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
        List<ChatMessagePayload> responseList = new ArrayList<>(dummyPayload);

        Collections.reverse(responseList);

        return ResponseUtil.page(responseList, meta, "Fetched group chat messages", httpRequest);
    }

    @PostMapping(value = "/group/{groupId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> sendGroupMessage(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long groupId,
            @RequestPart("data") @Valid SendMessageRequest request, // JSON data
            @RequestPart(value = "files", required = false) List<MultipartFile> files, // Files
            HttpServletRequest httpRequest
    ) {
        Long senderId = user.getId();

        chatService.sendGroupMessage(senderId, groupId, request, files);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getCode())
                .path(httpRequest.getRequestURI())
                .data(null)
                .message("Message sent")
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/group/{groupId}/call")

    public ResponseEntity<ApiResponse<VideoCallResponse>> startVideoCall(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long groupId
    ) {
        String channelName = String.valueOf(groupId);
        String userId = String.valueOf(user.getId());

        // 1. Tạo Token Agora
        String token = agoraService.generateToken(channelName, userId);
//        String token = null;

        // 2. Bắn tin Signaling vào Kafka (Để hiện thông báo: "User A đang gọi video...")
        // Chúng ta tái sử dụng ChatMessagePayload

        UserBrief brief = userMapper.toUserBrief(user);

        // 3. Trả Token về cho người gọi để họ vào phòng ngay
        VideoCallResponse response = agoraService.startVideoCall(token, groupId, brief);

        ApiResponse<VideoCallResponse> apiResponse = ApiResponse.<VideoCallResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getCode())
                .data(response)
                .message("Video call started")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}