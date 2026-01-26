package com.web.study.party.api;

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
@RequestMapping("/invites")
@RequiredArgsConstructor
public class InviteController {

    private final InvitationService invitationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvitationResponse>>> getUserInvitations(
            @AuthenticationPrincipal(expression = "user") Users invitee,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) String keyword,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        // Gọi Service lấy Page
        Page<InvitationResponse> invitationPage = invitationService.getPendingInvitationsForUser(invitee, status, keyword, pageable);

        return InvitationFilter.filterInvitationResponsePageable(status, keyword, req, invitationPage);
    }

    // API này cho user đã đăng nhập chấp nhận lời mời
    @PostMapping("/{token}/accept")
    public ResponseEntity<ApiResponse<String>> acceptInvite(
            @PathVariable String token,
            @AuthenticationPrincipal(expression = "user") Users user
    ) {
        invitationService.acceptInvitation(token, user.getId());
        ApiResponse<String> res = ApiResponse.<String>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getCode())
                .message("Invitation accepted successfully")
                .data(null)
                .build();
        return ResponseEntity.ok(res);
    }

    // API này bất cứ ai cũng có thể từ chối
    @PostMapping("/{token}/decline")
    public ResponseEntity<ApiResponse<String>> declineInvite(
            @PathVariable String token
    ) {
        invitationService.declineInvitation(token);
        ApiResponse<String> res = ApiResponse.<String>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getCode())
                .message("Invitation declined successfully")
                .data(null)
                .build();
        return ResponseEntity.ok(res);
    }
}