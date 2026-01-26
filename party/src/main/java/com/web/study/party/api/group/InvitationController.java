package com.web.study.party.api.group;

import com.web.study.party.dto.request.group.InvitationRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.InvitationResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.services.group.InvitationService;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.filters.InvitationFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups/{slug}/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createInvitation(
            @PathVariable String slug,
            @AuthenticationPrincipal(expression = "user") Users inviter,
            @RequestBody InvitationRequest request) {
        String inviteeEmail = request.email();
        invitationService.createInvitation(slug, inviter.getId(), inviteeEmail);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Invitation sent successfully")
                .data(null)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvitationResponse>>> getPendingInvitations(
            @PathVariable String slug,
            @AuthenticationPrincipal(expression = "user") Users owner,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt:desc") String sort,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) String keyword,
            HttpServletRequest req) {

        Pageable pageable = Paging.parsePageable(page, size, sort);

        Page<InvitationResponse> invitationPage = invitationService.getPendingInvitationsForGroup(slug, owner.getId(), status, keyword, pageable);

        return InvitationFilter.filterInvitationResponsePageable(status, keyword, req, invitationPage);
    }

    @DeleteMapping("/{invitationId}")
    public ResponseEntity<ApiResponse<Void>> revokeInvitation(
            @PathVariable String slug,
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
