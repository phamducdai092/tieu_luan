package com.web.study.party.repositories.task;

import com.web.study.party.entities.enums.task.TaskStatus;
import com.web.study.party.entities.task.Task;
import org.springframework.data.jpa.domain.Specification;
import java.time.Instant;

public class TaskSpecs {

    // 1. Lọc theo Group ID
    public static Specification<Task> hasGroupId(Long groupId) {
        return (root, query, cb) -> cb.equal(root.get("groupId"), groupId);
    }

    // 2. Chỉ lấy cái chưa xóa
    public static Specification<Task> isNotDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("isDeleted"));
    }

    // 3. (Optional) Tìm những task sắp hết hạn trong khoảng thời gian
    public static Specification<Task> deadlineBetween(Instant start, Instant end) {
        return (root, query, cb) -> cb.between(root.get("deadline"), start, end);
    }

    // 4. (Bonus) Search theo tiêu đề bài tập
    public static Specification<Task> titleContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            return cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
        };
    }

}