package com.web.study.party.repositories.group.task;

import com.web.study.party.entities.task.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Lấy danh sách task trong group, trừ những cái đã xóa
    @Query("SELECT t FROM Task t WHERE t.groupId = :groupId AND t.isDeleted = false")
    Page<Task> findByGroupIdAndIsDeletedFalse(@Param("groupId") Long groupId, Pageable pageable);

    // Tìm task sắp hết hạn (Dùng Instant thay vì Timestamp)
    @Query("SELECT t FROM Task t WHERE t.deadline BETWEEN :start AND :end AND t.isDeleted = false")
    List<Task> findByDeadlineBetweenAndIsDeletedFalse(
        @Param("start") Instant start, 
        @Param("end") Instant end
    );

    boolean existsByIdAndGroupId(Long id, Long groupId);
}