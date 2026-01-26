package com.web.study.party.dto.request.group.task;

import com.web.study.party.entities.enums.task.SubmissionType;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public record CreateTaskRequest(
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
    String title,

    @NotBlank(message = "Mô tả không được để trống")
    String description, // Rich text

    @NotNull(message = "Deadline là bắt buộc")
    @Future(message = "Deadline phải ở tương lai")
    Instant deadline,

    @NotNull(message = "Loại bài tập là bắt buộc")
    SubmissionType submissionType,

    @Size(max = 5, message = "Chỉ được giao tối đa 5 người")
    List<Long> assigneeIds // Nullable: Nếu null thì logic BE tự xử (vd: giao cả nhóm)
) {}