package com.web.study.party.entities.base;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.MessageType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@MappedSuperclass // Đánh dấu đây là class cha, không tạo bảng riêng
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private MessageType type;

    // Người gửi (Ai cũng phải có người gửi)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private Users sender;

    @Column(name = "attachment_url")
    private String attachmentUrl;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private boolean isDeleted = false;
}