package com.web.study.party.api.group;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.JoinRequestResponse;
import com.web.study.party.dto.response.user.UserJoinRequestResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.services.group.JoinRequestService;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.filters.GroupFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/request")
@RequiredArgsConstructor
public class JoinRequestController {

    private final JoinRequestService joinRequestService;

    @PostMapping("/{slug}")
    public ResponseEntity<ApiResponse<Void>> createJoinRequest(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable String slug) {
        joinRequestService.createJoinRequest(slug, user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Join request created successfully")
                .build());
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<ApiResponse<Void>> cancelJoinRequest(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable String slug) {

        joinRequestService.cancelJoinRequest(slug, user.getId());

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Join request canceled successfully")
                .build());
    }

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveJoinRequest(
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
            @PathVariable Long requestId,
            @AuthenticationPrincipal(expression = "user") Users user) {

        joinRequestService.rejectJoinRequest(requestId, user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .message("Join request rejected")
                .build());
    }

    @GetMapping("/group/{slug}")
    public ResponseEntity<ApiResponse<List<JoinRequestResponse>>> getJoinRequestsForGroup(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) RequestStatus status,
            @PathVariable String slug,
            HttpServletRequest req) {

        if (sort == null || sort.isEmpty()) {
            sort = "createdAt";
        }

        Pageable pageable = Paging.parsePageable(page, size, sort);
        var result = joinRequestService.getJoinRequestsForGroup(slug, user.getId(), pageable);

        return GroupFilter.filterJoinRequestResponsePageable(status, req, result);
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<UserJoinRequestResponse>>> getJoinRequestsForUser(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) RequestStatus status,
            HttpServletRequest req) {

        if (sort == null || sort.isEmpty()) {
            sort = "createdAt";
        }

        Pageable pageable = Paging.parsePageable(page, size, sort);

        var result = joinRequestService.getJoinRequestsForUser(user.getId(), pageable);

        return GroupFilter.filterUserJoinRequestResponsePageable(status, req, result);
    }
}
