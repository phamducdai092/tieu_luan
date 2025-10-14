package com.web.study.party.api.group;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.services.group.GroupMemberServiceImp;
import com.web.study.party.services.group.GroupServiceImp;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/groups/members")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupServiceImp groupService;
    private final GroupMemberServiceImp memberService;

    @PostMapping("/{gid}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveGroup(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable Long gid, HttpServletRequest httpRequest) {
        memberService.leave(user.getId(), gid);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Left group successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }


    @PostMapping("/{gid}/kick/{userId}")
    public ResponseEntity<ApiResponse<Void>> kickMember(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable Long gid, @PathVariable Long userId, HttpServletRequest httpRequest) {
        memberService.kick(user.getId(), gid, userId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Member kicked successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{gid}/role/{userId}")
    public ResponseEntity<ApiResponse<Void>> setMemberRole(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable Long gid, @PathVariable Long userId, @RequestParam String role, HttpServletRequest httpRequest) {
        memberService.setRole(user.getId(), gid, userId, Enum.valueOf(MemberRole.class, role));
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Member role updated successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{gid}/transfer/{newOwnerId}")
    public ResponseEntity<ApiResponse<Void>> transferOwnership(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable Long gid, @PathVariable Long newOwnerId, HttpServletRequest httpRequest) {
        memberService.transferOwnership(user.getId(), gid, newOwnerId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Group ownership transferred successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

}
