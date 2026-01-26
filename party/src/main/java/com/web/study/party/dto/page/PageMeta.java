package com.web.study.party.dto.page;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class PageMeta {
    private int page;           // 0-based
    private int size;
    private long totalItems;
    private int totalPages;
    private String sort;        // ví dụ: "createdAt,desc"
    private Map<String, Object> filters; // optional
}