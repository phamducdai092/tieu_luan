package com.web.study.party.socket;

import com.web.study.party.entities.Users;
import com.web.study.party.services.socket.PresenceService;
import com.web.study.party.utils.socket.SocketConst;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
import java.util.Map;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    // 1. KHI USER CONNECT (Mở web)
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        Users user = getUserFromEvent(event);
        if (user != null) {
            log.info("🔌 User Connected: {}", user.getEmail());
            presenceService.markUserOnline(user.getId());

            // Dùng SocketConst
            messagingTemplate.convertAndSend(SocketConst.TOPIC_PRESENCE_USERS, Map.of(
                    "userId", user.getId(),
                    "status", "ONLINE"
            ));
        }
    }

    // 2. KHI USER VÀO PHÒNG (Subscribe vào Topic Chat)
    @EventListener
    public void handleSubscribeListener(SessionSubscribeEvent event) {
        Users user = getUserFromEvent(event);
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();

        // 👇 FIX QUAN TRỌNG: Check đúng prefix "/topic/chat/" thay vì hardcode lung tung
        if (user != null && destination != null && destination.startsWith(SocketConst.PREFIX_TOPIC_CHAT_ROOM)) {

            Long roomId = extractRoomId(destination);
            if (roomId != null) {
                log.info("🚪 User {} entered Room {}", user.getEmail(), roomId);

                // 1. Join Redis
                presenceService.joinRoom(roomId, user.getId());

                // 2. Bắn số lượng mới
                broadcastRoomCount(roomId);
            }
        }
    }

    // 3. KHI USER DISCONNECT (Tắt web)
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Users user = getUserFromEvent(event);
        if (user != null) {
            log.info("❌ User Disconnected: {}", user.getEmail());

            presenceService.markUserOffline(user.getId());
            Set<Long> affectedRooms = presenceService.disconnectUser(user.getId());

            // Cập nhật lại số lượng cho các phòng bị ảnh hưởng
            for (Long roomId : affectedRooms) {
                broadcastRoomCount(roomId);
            }

            // Dùng SocketConst
            messagingTemplate.convertAndSend(SocketConst.TOPIC_PRESENCE_USERS, Map.of(
                    "userId", user.getId(),
                    "status", "OFFLINE"
            ));
        }
    }

    // --- Helper ---
    private void broadcastRoomCount(Long roomId) {
        Long count = presenceService.getRoomOnlineCount(roomId);
        // Dùng String.format với SocketConst để tạo topic: /topic/room/123/count
        String destination = String.format(SocketConst.PATTERN_TOPIC_ROOM_COUNT, roomId);
        messagingTemplate.convertAndSend(destination, count);
    }

    private Long extractRoomId(String destination) {
        try {
            // Destination: /topic/chat/123 -> Split ra lấy phần cuối
            String[] parts = destination.split("/");
            return Long.parseLong(parts[parts.length - 1]);
        } catch (Exception e) { return null; }
    }

    private Users getUserFromEvent(Object event) {
        if (event instanceof AbstractSubProtocolEvent subEvent) {
            Principal principal = subEvent.getUser();
            if (principal instanceof UsernamePasswordAuthenticationToken auth) {
                if (auth.getPrincipal() instanceof Users) {
                    return (Users) auth.getPrincipal();
                }
            }
        }
        return null;
    }
}