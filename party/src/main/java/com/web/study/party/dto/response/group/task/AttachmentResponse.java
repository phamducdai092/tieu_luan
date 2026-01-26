package com.web.study.party.dto.response.group.task;

import lombok.Builder;
import java.time.Instant;

@Builder
public record AttachmentResponse(
    Long id,
    String fileName,
    String fileUrl,
    String fileType,
    Long fileSize,
    Instant uploadedAt,
    Long uploadedById
) {}