package com.web.study.party.utils.filters;

import com.web.study.party.dto.pagination.PageMeta;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.user.UserSearchResponse;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public class UserFilter {

    public static ResponseEntity<ApiResponse<List<UserSearchResponse>>> filterUsers(
            HttpServletRequest req,
            Page<UserSearchResponse> result
    ) {

        // 2. Build PageMeta
        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))
                .filters(null)
                .build();

        // 3. Trả về Response chuẩn form
        return ResponseUtil.page(result.getContent(), meta, "Lấy danh sách lời mời thành công", req);
    }
}