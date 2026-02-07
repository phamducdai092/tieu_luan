package com.web.study.party.repositories.task.assignment;

import com.web.study.party.entities.task.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {

    List<TaskAssignment> findByTaskId(Long taskId);

    // Đếm số lượng người đã được giao task này
    long countByTaskId(Long taskId);

    // Xóa assignee (Nếu sau này làm tính năng un-assign)
    @Modifying
    @Query("DELETE FROM TaskAssignment ta WHERE ta.task.id = :taskId AND ta.userId IN :userIds")
    void deleteByTaskIdAndUserIdIn(@Param("taskId") Long taskId, @Param("userIds") List<Long> userIds);

}