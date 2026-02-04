package com.web.study.party.utils.filters;

import com.web.study.party.dto.pagination.PageMeta;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.task.SubmissionResponse;
import com.web.study.party.dto.response.group.task.TaskSummaryResponse;
import com.web.study.party.entities.enums.task.TaskStatus;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class TaskFilter {

    // Filter cho danh sách bài tập
    public static ResponseEntity<ApiResponse<List<TaskSummaryResponse>>> filterTaskResponsePageable(
            @RequestParam(required = false) TaskStatus status,
            HttpServletRequest req,
            Page<TaskSummaryResponse> result
    ) {
        Map<String, Object> filters = new LinkedHashMap<>();
        if (status != null) filters.put("status", status);

        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))
                .filters(filters.isEmpty() ? null : filters)
                .build();

        return ResponseUtil.page(result.getContent(), meta, "Lấy danh sách bài tập thành công", req);
    }

    // Filter cho danh sách bài nộp (Submission)
    public static ResponseEntity<ApiResponse<List<SubmissionResponse>>> filterSubmissionResponsePageable(
            HttpServletRequest req,
            Page<SubmissionResponse> result
    ) {
        PageMeta meta = PageMeta.builder()
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .sort(Paging.sortString(result.getSort()))
                .build();

        return ResponseUtil.page(result.getContent(), meta, "Lấy danh sách bài nộp thành công", req);
    }
}