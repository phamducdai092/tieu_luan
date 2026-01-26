package com.web.study.party.repositories.group.task;

import com.web.study.party.entities.task.TaskSubmission;
import com.web.study.party.entities.enums.task.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {

    // Tìm bài nộp của 1 user cụ thể trong task
    Optional<TaskSubmission> findByTaskIdAndUserId(Long taskId, Long userId);

    // Lấy danh sách nộp bài của task (Có phân trang cho API list submission)
    Page<TaskSubmission> findByTaskId(Long taskId, Pageable pageable);

    // Đếm số lượng bài theo status (Ví dụ: đếm bao nhiêu bài đã APPROVED)
    long countByTaskIdAndStatus(Long taskId, TaskStatus status);

    void deleteByTaskIdAndUserIdInAndStatus(Long task_id, Collection<Long> userId, TaskStatus status);
}