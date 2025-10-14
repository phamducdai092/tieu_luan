package com.web.study.party.api.group;

import com.web.study.party.dto.request.group.InvitationRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.InvitationResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.group.InvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups/{groupId}/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createInvitation(
            @PathVariable Long groupId,
            @AuthenticationPrincipal(expression = "user") Users inviter,
            @RequestBody InvitationRequest request) {
        String inviteeEmail = request.email();
        invitationService.createInvitation(groupId, inviter.getId(), inviteeEmail);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Invitation sent successfully")
                .data(null)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvitationResponse>>> getPendingInvitations(
            @PathVariable Long groupId,
            @AuthenticationPrincipal(expression = "user") Users owner) {
        List<InvitationResponse> invitations = invitationService.getPendingInvitationsForGroup(groupId, owner.getId());
        return ResponseEntity.ok(ApiResponse.<List<InvitationResponse>>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Pending invitations retrieved successfully")
                .data(invitations)
                .build());
    }

    @DeleteMapping("/{invitationId}")
    public ResponseEntity<ApiResponse<Void>> revokeInvitation(
            @PathVariable Long groupId,
            @PathVariable Long invitationId,
            @AuthenticationPrincipal(expression = "user") Users owner) {
        invitationService.revokeInvitation(invitationId, owner.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Invitation revoked successfully")
                .data(null)
                .build());
    }
}
