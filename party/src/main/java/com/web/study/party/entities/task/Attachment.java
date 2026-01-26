package com.web.study.party.entities.task;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.message.GroupMessages;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Entity
@Table(name = "attachments")
@Getter @Setter
@NoArgsConstructor
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = true)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = true)
    private TaskSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_message_id", nullable = true)
    private GroupMessages groupMessage;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, length = 500)
    private String filePath;

    @Column(nullable = false, length = 50)
    private String fileType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, updatable = false)
    private Instant uploadedAt = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = true)
    private Users uploadedBy;

    @Column(name = "is_deleted")
    private boolean isDeleted;

}