package com.web.study.party.services.socket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private static final String KEY_GLOBAL_ONLINE = "online_users";
    private static final String PREFIX_ROOM_ONLINE = "room:%d:online_users";
    private static final String PREFIX_USER_ROOMS = "user:%d:joined_rooms";

    private final RedisTemplate<String, String> redisTemplate;

    // --- 1. GLOBAL USER ONLINE ---
    public void markUserOnline(Long userId) {
        redisTemplate.opsForSet().add(KEY_GLOBAL_ONLINE, String.valueOf(userId));
    }

    public void markUserOffline(Long userId) {
        redisTemplate.opsForSet().remove(KEY_GLOBAL_ONLINE, String.valueOf(userId));
        // Khi offline global thì cũng tự động rời tất cả các phòng
        disconnectUser(userId);
    }

    public boolean isUserOnline(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(KEY_GLOBAL_ONLINE, String.valueOf(userId)));
    }

    public Set<Long> getOnlineUsers() {
        Set<String> members = redisTemplate.opsForSet().members(KEY_GLOBAL_ONLINE);
        if (members == null) return Set.of();
        return members.stream().map(Long::parseLong).collect(Collectors.toSet());
    }

    // --- 2. ROOM ONLINE ---

    public void joinRoom(Long roomId, Long userId) {
        // Lưu user vào phòng
        redisTemplate.opsForSet().add(String.format(PREFIX_ROOM_ONLINE, roomId), String.valueOf(userId));
        // Lưu phòng vào danh sách của user (Tracking)
        redisTemplate.opsForSet().add(String.format(PREFIX_USER_ROOMS, userId), String.valueOf(roomId));
    }

    public void leaveRoom(Long roomId, Long userId) {
        redisTemplate.opsForSet().remove(String.format(PREFIX_ROOM_ONLINE, roomId), String.valueOf(userId));
        redisTemplate.opsForSet().remove(String.format(PREFIX_USER_ROOMS, userId), String.valueOf(roomId));
    }

    public Long getRoomOnlineCount(Long roomId) {
        return redisTemplate.opsForSet().size(String.format(PREFIX_ROOM_ONLINE, roomId));
    }

    public Set<Long> disconnectUser(Long userId) {
        String userRoomsKey = String.format(PREFIX_USER_ROOMS, userId);
        Set<String> joinedRooms = redisTemplate.opsForSet().members(userRoomsKey);

        Set<Long> affectedRoomIds = new HashSet<>();

        if (joinedRooms != null) {
            for (String roomIdStr : joinedRooms) {
                Long roomId = Long.parseLong(roomIdStr);
                // Xóa user khỏi phòng đó
                redisTemplate.opsForSet().remove(String.format(PREFIX_ROOM_ONLINE, roomId), String.valueOf(userId));
                affectedRoomIds.add(roomId);
            }
        }

        // Xóa key tracking của user
        redisTemplate.delete(userRoomsKey);

        return affectedRoomIds;
    }
}