package com.web.study.party.dto.response.group.task;

import com.web.study.party.entities.enums.task.SubmissionType;
import lombok.Builder; // Record vẫn dùng Builder được nếu cần, hoặc dùng constructor
import java.time.Instant;
import java.util.List;

@Builder
public record TaskDetailResponse(
    Long id,
    Long groupId,
    String title,
    String description,
    Instant deadline,
    SubmissionType submissionType,
    Long createdBy,
    Instant createdAt,
    Instant updatedAt,
    List<AttachmentResponse> attachments,
    List<AssigneeResponse> assignees,
    SubmissionResponse mySubmission, // Bài nộp của user hiện tại
    Integer totalSubmissions,        // Thống kê
    Integer approvedSubmissions      // Thống kê
) {}