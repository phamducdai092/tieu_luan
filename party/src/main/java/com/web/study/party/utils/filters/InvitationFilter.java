package com.web.study.party.utils.filters;

import com.web.study.party.dto.page.PageMeta;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.InvitationResponse;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class InvitationFilter {

    public static ResponseEntity<ApiResponse<List<InvitationResponse>>> filterInvitationResponsePageable(
            RequestStatus status,
            String keyword,
            HttpServletRequest req,
            Page<InvitationResponse> result
    ) {
        // 1. Build map filters để trả về meta
        Map<String, Object> filters = new LinkedHashMap<>();
        if (status != null) filters.put("status", status);
        if (keyword != null && !keyword.isEmpty()) filters.put("keyword", keyword);

        // 2. Build PageMeta
        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))
                .filters(filters.isEmpty() ? null : filters)
                .build();

        // 3. Trả về Response chuẩn form
        return ResponseUtil.page(result.getContent(), meta, "Lấy danh sách lời mời thành công", req);
    }
}