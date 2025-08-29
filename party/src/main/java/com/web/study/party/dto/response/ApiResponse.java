package com.web.study.party.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApiResponse<T> {
    @Builder.Default
    private Instant timestamp = Instant.now();
    private String path;
    private int status;
    private String code;
    private String message;
    private T data;
    private Object meta;
}
