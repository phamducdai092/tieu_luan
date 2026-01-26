package com.web.study.party.api;

import com.web.study.party.services.socket.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/presence")
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    @GetMapping("/active-users")
    public ResponseEntity<Set<Long>> getActiveUsers() {
        return ResponseEntity.ok(presenceService.getOnlineUsers());
    }

    @GetMapping("/room/{roomId}/count")
    public ResponseEntity<Long> getRoomCount(@PathVariable Long roomId) {
        return ResponseEntity.ok(presenceService.getRoomOnlineCount(roomId));
    }
}