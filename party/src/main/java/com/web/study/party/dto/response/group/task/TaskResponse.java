package com.web.study.party.dto.response.group.task;

import com.web.study.party.entities.enums.task.SubmissionType;
import lombok.Builder;
import java.time.Instant;
import java.util.List;

@Builder
public record TaskResponse(
    Long id,
    Long groupId,
    String title,
    String description,
    Instant deadline,
    SubmissionType submissionType,
    Long createdBy,
    Instant createdAt,
    Instant updatedAt,
    boolean isDeleted,
    List<AttachmentResponse> attachments,
    List<AssigneeResponse> assignees
) {}