package com.web.study.party.api.group;

import com.web.study.party.dto.request.group.GroupCreateRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.PageMeta;
import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.group.GroupServiceImp;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

        return filterPageable(topic, keyword, req, result);
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

        return filterPageable(topic, keyword, req, result);
    }

    @PutMapping("/{gid}")
    public ResponseEntity<ApiResponse<GroupResponse>> update(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable Long gid, @Valid @RequestBody GroupCreateRequest req, HttpServletRequest httpRequest) {
        GroupResponse group = groupService.update(user.getId(), gid, req);
        ApiResponse<GroupResponse> response = ApiResponse.<GroupResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(group)
                .message("Group updated successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{gid}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable Long gid, HttpServletRequest httpRequest) {
        groupService.delete(user.getId(), gid);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Group deleted successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<ApiResponse<List<GroupCardResponse>>> filterPageable(@RequestParam(required = false) String topic, @RequestParam(required = false) String keyword, HttpServletRequest req, Page<GroupCardResponse> result) {
        Map<String, Object> filters = new LinkedHashMap<>();
        if (topic != null && !topic.isBlank()) filters.put("topic", topic);
        if (keyword != null && !keyword.isBlank()) filters.put("keyword", keyword);

        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())               // 0-based
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))     // ví dụ "updatedAt: DESC,name: ASC"
                .filters(filters.isEmpty() ? null : filters)
                .build();

        return ResponseUtil.page(result.getContent(), meta, "Fetched joined groups", req);
    }
}
