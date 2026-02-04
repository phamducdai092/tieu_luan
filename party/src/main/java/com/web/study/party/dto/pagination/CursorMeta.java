package com.web.study.party.dto.pagination;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class CursorMeta {
    private Integer limit;
    private String nextCursor;  // null nếu hết trang
    private String prevCursor;  // optional
    private Map<String, Object> filters; // optional
}