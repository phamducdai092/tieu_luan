package com.web.study.party.api.group;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.group.JoinRequestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/groups/{groupId}/requests")
@RequiredArgsConstructor
public class JoinRequestController {

    private final JoinRequestService joinRequestService;

    @PostMapping()
    public ResponseEntity<ApiResponse<Void>> createJoinRequest(
            @PathVariable Long groupId,
            @AuthenticationPrincipal(expression = "user") Users user) {
        joinRequestService.createJoinRequest(groupId, user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Join request created successfully")
                .build());
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<?>> getJoinRequestsForGroup(
            @PathVariable Long groupId,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest req) {

        var requests = joinRequestService.getJoinRequestsForGroup(groupId, user.getId());
        return ResponseEntity.ok(ApiResponse.builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Join requests retrieved successfully")
                .data(requests)
                .path(req.getRequestURI())
                .build());
    }

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveJoinRequest(
            @PathVariable Long groupId,
            @PathVariable Long requestId,
            @AuthenticationPrincipal(expression = "user") Users user) {

        joinRequestService.approveJoinRequest(requestId, user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Join request approved successfully")
                .build());
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectJoinRequest(
            @PathVariable Long groupId,
            @PathVariable Long requestId,
            @AuthenticationPrincipal(expression = "user") Users user) {

        joinRequestService.rejectJoinRequest(requestId, user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Join request rejected successfully")
                .build());
    }

}
