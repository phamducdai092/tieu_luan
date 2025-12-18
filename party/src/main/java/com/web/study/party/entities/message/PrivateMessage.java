package com.web.study.party.entities.message;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.base.BaseMessage;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "private_messages", indexes = {
        @Index(name = "idx_receiver_created", columnList = "receiver_id, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrivateMessage extends BaseMessage {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Users receiver; // Người nhận
}
