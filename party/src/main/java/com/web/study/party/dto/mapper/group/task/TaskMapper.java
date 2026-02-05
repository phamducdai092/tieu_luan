package com.web.study.party.dto.mapper.group.task;

import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.response.group.task.*;
import com.web.study.party.entities.task.Attachment;
import com.web.study.party.entities.task.Task;
import com.web.study.party.entities.task.TaskAssignment;
import com.web.study.party.entities.task.TaskSubmission;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public abstract class TaskMapper {

    @Autowired
    private UserMapper userMapper;

    // --- 1. Map Task to TaskResponse ---
    @Mapping(target = "assignees", source = "assignments")
    public abstract TaskResponse toResponse(Task task);

    // --- 2. Map Task to TaskDetailResponse ---
    @Mapping(target = "assignees", source = "assignments")
    @Mapping(target = "mySubmission", ignore = true) // Sẽ set tay trong Service
    @Mapping(target = "totalSubmissions", ignore = true)
    @Mapping(target = "approvedSubmissions", ignore = true)
    public abstract TaskDetailResponse toDetailResponse(Task task);

    // --- 3. Map Task to TaskSummaryResponse ---
    @Mapping(target = "assigneeCount", expression = "java(task.getAssignments().size())")
    @Mapping(target = "mySubmissionStatus", ignore = true) // Cần logic phức tạp hơn
    @Mapping(target = "isOverdue", expression = "java(task.getDeadline().isBefore(java.time.Instant.now()))")
    @Mapping(target = "isDeleted", source = "isDeleted")
    public abstract TaskSummaryResponse toSummaryResponse(Task task);

    // --- 4. Map Submission to SubmissionResponse ---
    // Giả sử m có User entity, cần map user name/avatar từ userId. 
    // Ở đây t map tạm các field cơ bản, m nên inject UserRepo hoặc UserMapper để lấy tên user
    public abstract SubmissionResponse toSubmissionResponse(TaskSubmission submission);

    // --- 5. Map Attachment ---
    @Mapping(target = "fileUrl", source = "filePath") // Hoặc logic tạo presigned URL
    public abstract AttachmentResponse toAttachmentResponse(Attachment attachment);
    public abstract List<AttachmentResponse> toAttachmentResponseList(List<Attachment> attachments);

    // --- 6. Map Assignee ---
    // Map từ TaskAssignment -> AssigneeResponse
    @Mapping(target = "userName", ignore = true) // Cần UserRepo để lấy tên
    @Mapping(target = "userAvatar", ignore = true)
    @Mapping(target = "email", ignore = true)
    public abstract AssigneeResponse toAssigneeResponse(TaskAssignment assignment);
    public abstract List<AssigneeResponse> toAssigneeResponseList(List<TaskAssignment> assignments);

    // --- Helper để mapping list ---
    public abstract List<TaskSummaryResponse> toSummaryResponseList(List<Task> tasks);
}