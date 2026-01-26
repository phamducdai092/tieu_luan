package com.web.study.party.entities.message;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.MessageType;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.entities.task.Attachment;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "group_messages", indexes = {
        @Index(name = "idx_group_created", columnList = "group_id, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMessages {

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroups group;

    @OneToMany(mappedBy = "groupMessage", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attachment> attachments;
}