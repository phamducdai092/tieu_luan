package com.web.study.party.entities.task;

import com.web.study.party.entities.enums.task.TaskStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "task_submissions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"task_id", "user_id"})
})
@Getter @Setter
@NoArgsConstructor
public class TaskSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false)
    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String submissionText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.ASSIGNED;

    private Instant submittedAt;

    private Long reviewedBy;

    private Instant reviewedAt;

    @Column(columnDefinition = "TEXT")
    private String reviewNotes;

    @Column(nullable = true)
    private Integer grade;

    @Column(nullable = false)
    private Integer version = 1;

    private boolean isLate = false;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments = new ArrayList<>();

    public void addAttachment(Attachment attachment) {
        attachments.add(attachment);
        attachment.setSubmission(this);
        attachment.setTask(null);
    }
}