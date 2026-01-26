package com.web.study.party.entities.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "group_invites")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private StudyGroups group;

    @ManyToOne
    @JoinColumn(name = "inviter_id")
    private Users inviter;

    @ManyToOne
    @JoinColumn(name = "invitee_id")
    private Users invitee;

    // Hoặc có thể lưu email cho người chưa có tài khoản
    // private String inviteeEmail;

    @Column(unique = true, length = 64)
    private String token; // dùng cho link invite

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING; // PENDING, ACCEPTED, DECLINED

    private Instant expiresAt;

    private Instant createdAt;
}