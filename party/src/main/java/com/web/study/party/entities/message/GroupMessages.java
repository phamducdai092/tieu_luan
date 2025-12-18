package com.web.study.party.entities.message;

import com.web.study.party.entities.base.BaseMessage;
import com.web.study.party.entities.group.StudyGroups;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "group_messages", indexes = {
        @Index(name = "idx_group_created", columnList = "group_id, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMessages extends BaseMessage {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroups group;
}