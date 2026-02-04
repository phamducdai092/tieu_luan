package com.web.study.party.dto.pagination;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CursorResponse<T> {
    private List<T> data;
    private CursorMeta meta;
}