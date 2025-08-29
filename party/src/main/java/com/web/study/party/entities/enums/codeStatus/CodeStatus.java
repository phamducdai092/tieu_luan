package com.web.study.party.entities.enums.codeStatus;

import lombok.*;

@Getter
public enum CodeStatus {
    SUCCESS(200, "Request was successful"),
    BAD_REQUEST(400, "Bad request"),
    UNAUTHORIZED(401, "Unauthorized access"),
    FORBIDDEN(403, "Forbidden access"),
    NOT_FOUND(404, "Resource not found"),
    INTERNAL_SERVER_ERROR(500, "Internal server error");

    private final int code;
    private final String message;
    CodeStatus(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
