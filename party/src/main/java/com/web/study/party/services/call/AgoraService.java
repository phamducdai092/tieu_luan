package com.web.study.party.services.call;

import com.web.study.party.dto.kafka.ChatMessagePayload;
import com.web.study.party.dto.response.call.VideoCallResponse;
import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.group.MessageType;
import com.web.study.party.services.chat.ChatProducer;
import com.web.study.party.utils.call.AgoraTokenUtils;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Getter
@Service
@RequiredArgsConstructor
public class AgoraService {
    private final ChatProducer chatProducer;

    @Value("${agora.app.id}")
    private String appId;

    @Value("${agora.app.certificate}")
    private String appCertificate;

    @Value("${agora.token.expiration}")
    private int tokenExpirationInSeconds;

    public String generateToken(String channelName, String userId) {
        // Tính thời gian hết hạn (Timestamp hiện tại + 3600s)
//        int timestamp = (int)(System.currentTimeMillis() / 1000 + tokenExpirationInSeconds);
//
//        // Gọi Utils để tạo Token
//        // Role_Publisher: Cho phép người dùng bật Mic/Cam
//
//        return AgoraTokenUtils.buildToken(
//                appId,
//                appCertificate,
//                channelName,
//                userId,
//                AgoraTokenUtils.Role.Role_Publisher,
//                timestamp
//        );
        return null;
    }

    public VideoCallResponse startVideoCall(String token, Long groupId, UserBrief caller) {
        String channelName = String.valueOf(groupId);

        ChatMessagePayload signalMsg = new ChatMessagePayload(
                null, // ID null vì đây là tin hệ thống, ko cần lưu DB (hoặc tùy)
                caller,
                null, // Vai trò ko cần thiết ở đây
                groupId,
                "Đã bắt đầu cuộc gọi video 📞", // Nội dung hiển thị text
                MessageType.VIDEO_CALL,
                Instant.now(),
                true, // isGroup
                null // attachments
        );

        chatProducer.sendMessage(signalMsg);

        return new VideoCallResponse(
                token,
                channelName,
                appId
        );
    }
}