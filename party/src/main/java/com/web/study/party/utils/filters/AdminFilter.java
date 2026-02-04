package com.web.study.party.utils.filters;

import com.web.study.party.dto.pagination.PageMeta;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.admin.AdminFileResponse;
import com.web.study.party.dto.response.admin.AdminGroupResponse;
import com.web.study.party.dto.response.admin.AdminUserResponse;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdminFilter {

    public static ResponseEntity<ApiResponse<List<AdminUserResponse>>> filterUserResponses(
            HttpServletRequest req,
            Page<AdminUserResponse> users,
            String order
    ) {
        Map<String, Object> filters = new HashMap<>();
        if (order != null && !order.isBlank()) filters.put("order", order);

        PageMeta meta = PageMeta.builder()
                .page(users.getNumber())               // 0-based
                .size(users.getSize())
                .totalItems(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .sort(users.getSort().isSorted() ? users.getSort().toString().replace(": ", ",") : null)     // ví dụ "updatedAt: DESC,name: ASC"
                .filters(filters.isEmpty() ? null : filters)
                .build();
        return ResponseUtil.page(users.getContent(), meta, "Fetched user information successfully", req);
    }

    public static ResponseEntity<ApiResponse<List<AdminGroupResponse>>> filterGroupResponses(
            HttpServletRequest req,
            Page<AdminGroupResponse> groups,
            String order
    ) {
        Map<String, Object> filters = new HashMap<>();
        if (order != null && !order.isBlank()) filters.put("order", order);

        PageMeta meta = PageMeta.builder()
                .page(groups.getNumber())               // 0-based
                .size(groups.getSize())
                .totalItems(groups.getTotalElements())
                .totalPages(groups.getTotalPages())
                .sort(groups.getSort().isSorted() ? groups.getSort().toString().replace(": ", ",") : null)     // ví dụ "updatedAt: DESC,name: ASC"
                .filters(filters.isEmpty() ? null : filters)
                .build();
        return ResponseUtil.page(groups.getContent(), meta, "Fetched group information successfully", req);
    }

    public static ResponseEntity<ApiResponse<List<AdminFileResponse>>> filterFileResponses(
            HttpServletRequest req,
            Page<AdminFileResponse> files,
            String order
    ) {
        Map<String, Object> filters = new HashMap<>();
        if (order != null && !order.isBlank()) filters.put("order", order);

        PageMeta meta = PageMeta.builder()
                .page(files.getNumber())               // 0-based
                .size(files.getSize())
                .totalItems(files.getTotalElements())
                .totalPages(files.getTotalPages())
                .sort(files.getSort().isSorted() ? files.getSort().toString().replace(": ", ",") : null)     // ví dụ "updatedAt: DESC,name: ASC"
                .filters(filters.isEmpty() ? null : filters)
                .build();
        return ResponseUtil.page(files.getContent(), meta, "Fetched file information successfully", req);
    }

}
