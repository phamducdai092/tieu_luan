package com.web.study.party.repositories.task.submission;

import com.web.study.party.entities.enums.task.TaskStatus;
import com.web.study.party.entities.task.TaskSubmission;
import org.springframework.data.jpa.domain.Specification;

public class TaskSubmissionSpecs {

    public static Specification<TaskSubmission> hasTaskId(Long taskId) {
        return (root, query, cb) -> cb.equal(root.get("task").get("id"), taskId);
    }

    public static Specification<TaskSubmission> hasStatus(TaskStatus status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }
    
    // Lọc bài nộp muộn
    public static Specification<TaskSubmission> isLate(Boolean isLate) {
        return (root, query, cb) -> {
            if (isLate == null) return null;
            return cb.equal(root.get("isLate"), isLate);
        };
    }
}