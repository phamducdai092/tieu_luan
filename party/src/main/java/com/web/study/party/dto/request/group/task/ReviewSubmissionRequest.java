package com.web.study.party.dto.request.group.task;

import com.web.study.party.entities.enums.task.TaskStatus;
import jakarta.validation.constraints.*;

public record ReviewSubmissionRequest(
    @NotNull(message = "Trạng thái là bắt buộc")
    TaskStatus status,

    String reviewNotes,
    
    @Min(value = 0, message = "Điểm thấp nhất là 0")
    @Max(value = 100, message = "Điểm cao nhất là 100")
    Integer grade
) {
    // Custom Validation trong Record
    @AssertTrue(message = "Trạng thái chỉ được là APPROVED hoặc REQUEST_CHANGE")
    public boolean isValidStatus() {
        return status == TaskStatus.APPROVED || status == TaskStatus.REQUEST_CHANGE;
    }
}