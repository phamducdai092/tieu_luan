package com.web.study.party.repositories.chat;

import com.web.study.party.entities.message.GroupMessages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMessageRepo extends JpaRepository<GroupMessages, Long> {
    // Lấy lịch sử chat (phân trang)
    Page<GroupMessages> findByGroupIdOrderByCreatedAtDesc(Long groupId, Pageable pageable);
}