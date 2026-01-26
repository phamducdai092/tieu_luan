package com.web.study.party.api.group.task;

import com.web.study.party.dto.request.group.task.*;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.task.*;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.entities.enums.task.TaskStatus;
import com.web.study.party.services.task.TaskService;
import com.web.study.party.utils.PermissionChecker;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.filters.TaskFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/groups/{groupId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final PermissionChecker permissionChecker;

    // 1. Create Task
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @PathVariable Long groupId,
            @RequestPart("data") @Valid CreateTaskRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest httpRequest) {

        // Check quyền: Phải là Mod hoặc Owner
        permissionChecker.requireMod(user.getId(), groupId);

        TaskResponse task = taskService.createTask(groupId, request, files, user.getId());

        // Build Response thủ công như GroupController
        ApiResponse<TaskResponse> response = ApiResponse.<TaskResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(task)
                .message("Tạo bài tập thành công")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. Update Task
    @PostMapping(value = "/{taskId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long groupId,
            @PathVariable Long taskId,
            @RequestPart("data") @Valid UpdateTaskRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest httpRequest) {

        permissionChecker.requireMod(user.getId(), groupId);

        // Gọi service (đảm bảo service đã update nhận files như t gửi ở trên)
        TaskResponse task = taskService.updateTask(taskId, groupId, request, files, user.getId());

        ApiResponse<TaskResponse> response = ApiResponse.<TaskResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(task)
                .message("Cập nhật bài tập thành công")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    // 3. Get Task Details
    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskDetailResponse>> getTaskDetails(
            @PathVariable Long groupId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest httpRequest) {

        // Check quyền: Chỉ cần là Member
        permissionChecker.requireMember(user.getId(), groupId);

        TaskDetailResponse task = taskService.getTaskDetails(taskId, groupId, user.getId());

        ApiResponse<TaskDetailResponse> response = ApiResponse.<TaskDetailResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(task)
                .message("Lấy thông tin thành công")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    // 4. List Tasks (Dùng TaskFilter)
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskSummaryResponse>>> listTasks(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) TaskStatus status,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest req) {

        permissionChecker.requireMember(user.getId(), groupId);

        Pageable pageable = Paging.parsePageable(page, size, sort);
        Page<TaskSummaryResponse> taskPage = taskService.listTasks(groupId, status, pageable);

        // Dùng Filter để đóng gói response
        return TaskFilter.filterTaskResponsePageable(status, req, taskPage);
    }

    // 5. Submit Task
    @PostMapping(value = "/{taskId}/submissions", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitTask(
            @PathVariable Long groupId,
            @PathVariable Long taskId,
            @RequestPart("data") @Valid SubmitTaskRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest httpRequest) {

        permissionChecker.requireMember(user.getId(), groupId);

        SubmissionResponse submission = taskService.submitTask(
                taskId, groupId, user.getId(), request, files);

        ApiResponse<SubmissionResponse> response = ApiResponse.<SubmissionResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(submission)
                .message("Nộp bài thành công")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 6. Review Submission
    @PutMapping("/{taskId}/submissions/{submissionId}/review")
    public ResponseEntity<ApiResponse<SubmissionResponse>> reviewSubmission(
            @PathVariable Long groupId,
            @PathVariable Long taskId,
            @PathVariable Long submissionId,
            @Valid @RequestBody ReviewSubmissionRequest request,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest httpRequest) {

        permissionChecker.requireMod(user.getId(), groupId);

        SubmissionResponse submission = taskService.reviewSubmission(
                submissionId, taskId, request, user.getId());

        ApiResponse<SubmissionResponse> response = ApiResponse.<SubmissionResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(submission)
                .message("Chấm bài thành công")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    // 7. Get Submissions List (Update trả về Page để dùng Filter)
    @GetMapping("/{taskId}/submissions")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getSubmissionStatuses(
            @PathVariable Long groupId,
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest req) {

        permissionChecker.requireMember(user.getId(), groupId);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));

        Page<SubmissionResponse> statuses = taskService.getSubmissionStatuses(
                taskId, groupId, user.getId(), pageable);

        return TaskFilter.filterSubmissionResponsePageable(req, statuses);
    }

    // 8. Delete Task
    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long groupId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal(expression = "user") Users user,
            HttpServletRequest httpRequest) {

        permissionChecker.requireMod(user.getId(), groupId);

        taskService.deleteTask(taskId, groupId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Xóa bài tập thành công")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }
}