package com.web.study.party.dto.response.admin;

import java.time.Instant;

public record AdminFileResponse(
        Long id,
        String fileName,
        String fileUrl,
        String fileType,
        Long fileSize,
        Instant uploadedAt,
        Long uploadedById
) {
}
