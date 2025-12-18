package com.web.study.party.api.group;

import com.web.study.party.dto.request.group.ChangeRoleRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.MemberResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.services.group.GroupMemberServiceImp;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.filters.GroupMemberFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Member;
import java.util.List;

@RestController
@RequestMapping("/groups/members")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupMemberServiceImp memberService;

    @GetMapping("/{gid}")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getGroupMembers(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) MemberRole role,
            HttpServletRequest httpRequest) {

        if (sort == null || sort.isEmpty()) {
            sort = "joinedAt";
        }

        Pageable pageable = Paging.parsePageable(page, size, sort);

        var membersPage = memberService.getMembers(gid, user, pageable);

        return GroupMemberFilter.filterMemberResponse(role, httpRequest, membersPage);
    }

    @DeleteMapping("/{gid}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveGroup(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            HttpServletRequest httpRequest
    ) {
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


    @DeleteMapping("/{gid}/kick/{userId}")
    public ResponseEntity<ApiResponse<Void>> kickMember(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @PathVariable Long userId,
            HttpServletRequest httpRequest
    ) {
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


    @PutMapping("/{gid}/role/{memberId}")
    public ResponseEntity<ApiResponse<Void>> setMemberRole(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @PathVariable Long memberId,
            @RequestBody ChangeRoleRequest role,
            HttpServletRequest httpRequest
    ) {
        memberService.setRole(user.getId(), gid, memberId, role.newMemberRole());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Member role updated successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{gid}/transfer-ownership/{newOwnerId}")
    public ResponseEntity<ApiResponse<Void>> transferOwnership(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @PathVariable Long newOwnerId,
            HttpServletRequest httpRequest
    ) {
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
