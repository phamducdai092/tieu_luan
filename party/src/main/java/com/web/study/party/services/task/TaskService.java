package com.web.study.party.services.task;

import com.web.study.party.dto.request.group.task.CreateTaskRequest;
import com.web.study.party.dto.request.group.task.ReviewSubmissionRequest;
import com.web.study.party.dto.request.group.task.SubmitTaskRequest;
import com.web.study.party.dto.request.group.task.UpdateTaskRequest;
import com.web.study.party.dto.response.group.task.*;
import com.web.study.party.entities.enums.task.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TaskService {
    
    // 1. Tạo bài tập (kèm file)
    TaskResponse createTask(Long groupId, CreateTaskRequest request, List<MultipartFile> files, Long creatorId);

    // 2. Cập nhật bài tập
    TaskResponse updateTask(Long taskId, Long groupId, UpdateTaskRequest request, List<MultipartFile> files, Long updaterId);

    // 3. Xem chi tiết
    TaskDetailResponse getTaskDetails(Long taskId, Long groupId, Long userId);

    // 4. Danh sách bài tập (Phân trang)
    Page<TaskSummaryResponse> listTasks(Long groupId, String keyword, Pageable pageable);

    // 5. Nộp bài (kèm file)
    SubmissionResponse submitTask(Long taskId, Long groupId, Long userId, SubmitTaskRequest request, List<MultipartFile> files);

    // 6. Chấm bài
    SubmissionResponse reviewSubmission(Long submissionId, Long taskId, ReviewSubmissionRequest request, Long reviewerId);

    // 7. Lấy danh sách bài nộp (Phân trang)
    Page<SubmissionResponse> getSubmissionStatuses(Long taskId, Long groupId, Long userId, Pageable pageable);

    // 8. Xóa bài tập
    void deleteTask(Long taskId, Long groupId);
}