package com.web.study.party.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ApiError<T> {
    @Builder.Default
    private Instant timestamp = Instant.now();
    private String path;
    private int status;
    private String code;     // VALIDATION_ERROR, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND...
    private String message;
    @Singular("fieldError")
    private List<FieldError> fieldErrors;

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class FieldError {
        private String field;
        private String message;
        private Object rejectedValue;
    }
}
