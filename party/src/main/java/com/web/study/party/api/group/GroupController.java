package com.web.study.party.api.group;

import com.web.study.party.dto.request.group.GroupCreateRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.dto.response.group.GroupDetailResponse;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.group.GroupServiceImp;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.filters.GroupFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupServiceImp groupService;

    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponse>> create(@AuthenticationPrincipal(expression = "user") Users user, @Valid @RequestBody GroupCreateRequest req, HttpServletRequest httpRequest) {
        GroupResponse group = groupService.create(user.getId(), req);
        ApiResponse<GroupResponse> response = ApiResponse.<GroupResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(group)
                .message("Group created successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/joined")
    public ResponseEntity<ApiResponse<List<GroupCardResponse>>> getJoinedGroups(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String keyword,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);
        var result = groupService.getJoinedGroups(user.getId(), pageable);

        return GroupFilter.filterGroupCardResponsePageable(topic, keyword, req, result);
    }

    @GetMapping("/owned")
    public ResponseEntity<ApiResponse<List<GroupCardResponse>>> getOwnedGroups(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String keyword,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        var result = groupService.getOwnedGroups(user.getId(), pageable);

        return GroupFilter.filterGroupCardResponsePageable(topic, keyword, req, result);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<GroupDetailResponse>> getGroupDetails(
            @AuthenticationPrincipal(expression = "user") Users currentUser,
            @PathVariable String slug,
            HttpServletRequest httpRequest
    ) {
        GroupDetailResponse groupDetails = groupService.getDetailBySlug(slug, currentUser);

        ApiResponse<GroupDetailResponse> response = ApiResponse.<GroupDetailResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(groupDetails)
                .path(httpRequest.getRequestURI())
                .message("Lấy thông tin phòng thành công")
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{slug}")
    public ResponseEntity<ApiResponse<GroupResponse>> update(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable String slug, @Valid @RequestBody GroupCreateRequest req, HttpServletRequest httpRequest) {
        GroupResponse group = groupService.update(user.getId(), slug, req);
        ApiResponse<GroupResponse> response = ApiResponse.<GroupResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(group)
                .message("Group updated successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable String slug, HttpServletRequest httpRequest) {
        groupService.delete(user.getId(), slug);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Group deleted successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }
}
