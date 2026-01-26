package com.web.study.party.dto.request.group.task;

import com.web.study.party.entities.enums.task.SubmissionType;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public record UpdateTaskRequest(
    @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
    String title,

    String description,

    @Future(message = "Deadline phải ở tương lai")
    Instant deadline,

    SubmissionType submissionType,

    List<Long> assigneeIds
) {}