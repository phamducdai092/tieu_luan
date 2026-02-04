package com.web.study.party.repositories.chat;

import com.web.study.party.entities.message.GroupMessages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepo extends JpaRepository<GroupMessages, Long> {
    // Lấy lịch sử chat (phân trang)
    Page<GroupMessages> findByGroupIdOrderByCreatedAtDesc(Long groupId, Pageable pageable);

    // Query 1: Load lần đầu (chưa có cursor, lấy mới nhất)
    // Dùng @EntityGraph để fetch luôn attachments và sender, tránh lỗi Lazy loading & N+1
    @EntityGraph(attributePaths = {"sender", "attachments"})
    List<GroupMessages> findTop20ByGroupIdOrderByCreatedAtDesc(Long groupId);

    // Query 2: Load khi cuộn (có cursor)
    @EntityGraph(attributePaths = {"sender", "attachments"})
    List<GroupMessages> findTop20ByGroupIdAndIdLessThanOrderByCreatedAtDesc(Long groupId, Long cursorId);
}