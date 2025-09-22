package com.web.study.party.entities.group;

import jakarta.persistence.*;

import java.time.Instant;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "group_invites")
public class GroupInvite {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    Long id;
    Long groupId;
    Long inviterId;
    Long inviteeId; // nếu invite qua email -> lưu email
    @Column(unique = true, length = 64)
    String token; // dùng cho link invite
    Instant expiresAt;
    Boolean accepted = false;
    Boolean declined = false;
}