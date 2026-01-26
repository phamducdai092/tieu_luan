package com.web.study.party.utils.filters;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.page.PageMeta;
import com.web.study.party.dto.response.group.MemberResponse;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class GroupMemberFilter {

    public static ResponseEntity<ApiResponse<List<MemberResponse>>> filterMemberResponse(
            @RequestParam(required = false) MemberRole role,
            HttpServletRequest req,
            Page<MemberResponse> result
    ) {
        Map<String, Object> filters = new LinkedHashMap<>();
        if (role != null) filters.put("role", role);

        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())               // 0-based
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))     // ví dụ "updatedAt: DESC,name: ASC"
                .filters(filters.isEmpty() ? null : filters)
                .build();

        return ResponseUtil.page(result.getContent(), meta, "Fetched group members successfully", req);
    }

}
