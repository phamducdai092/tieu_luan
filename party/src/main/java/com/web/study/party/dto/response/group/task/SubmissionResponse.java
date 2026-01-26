package com.web.study.party.dto.response.group.task;

import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.enums.task.TaskStatus;
import lombok.Builder;
import java.time.Instant;
import java.util.List;

@Builder
public record SubmissionResponse(
    Long id,
    Long taskId,
    UserBrief user, // Nên thêm avatar để hiển thị UI cho đẹp
    String submissionText,
    TaskStatus status,
    Instant submittedAt,
    Long reviewedBy,
    String reviewedByName,
    Instant reviewedAt,
    String reviewNotes,
    Integer grade,
    Integer version,
    List<AttachmentResponse> attachments
) {}