package com.web.study.party.utils.filters;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.pagination.PageMeta;
import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.dto.response.group.JoinRequestResponse;
import com.web.study.party.dto.response.user.UserJoinRequestResponse;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class GroupFilter {

    public static ResponseEntity<ApiResponse<List<GroupCardResponse>>> filterGroupCardResponsePageable(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String keyword,
            HttpServletRequest req,
            Page<GroupCardResponse> result
    ) {

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

    public static ResponseEntity<ApiResponse<List<JoinRequestResponse>>> filterJoinRequestResponsePageable(
            @RequestParam(required = false) RequestStatus status,
            HttpServletRequest req,
            Page<JoinRequestResponse> result
    ) {

        Map<String, Object> filters = new LinkedHashMap<>();
        if (status != null) filters.put("status", status);

        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())               // 0-based
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))     // ví dụ "updatedAt: DESC,name: ASC"
                .filters(filters.isEmpty() ? null : filters)
                .build();

        return ResponseUtil.page(result.getContent(), meta, "Fetched join requests", req);
    }

    public static ResponseEntity<ApiResponse<List<UserJoinRequestResponse>>> filterUserJoinRequestResponsePageable(@RequestParam(required = false) RequestStatus status, HttpServletRequest req, Page<UserJoinRequestResponse> result) {
        Map<String, Object> filters = new LinkedHashMap<>();
        if (status != null) filters.put("status", status);

        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())               // 0-based
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))     // ví dụ "updatedAt: DESC,name: ASC"
                .filters(filters.isEmpty() ? null : filters)
                .build();

        return ResponseUtil.page(result.getContent(), meta, "Fetched join requests", req);
    }

}
