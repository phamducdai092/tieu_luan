package com.web.study.party.api;

// ... imports

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.group.InvitationService;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.shaded.io.opentelemetry.proto.trace.v1.Status;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invites")
@RequiredArgsConstructor
public class InviteController {

    private final InvitationService invitationService;

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