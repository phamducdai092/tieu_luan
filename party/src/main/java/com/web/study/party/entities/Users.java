package com.web.study.party.entities;

import com.web.study.party.entities.enums.AccountStatus;
import com.web.study.party.entities.enums.Role;
import com.web.study.party.entities.group.GroupMembers;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatarUrl;
    private String bannerUrl;
    private String displayName;
    private String bio;
    private String phoneNumber;
    private Instant dateOfBirth;

    @Column(name = "is_online", nullable = false)
    private boolean online;
    @Column(name = "is_verified", nullable = false)
    private boolean verified;
    @Column(name = "is_locked", nullable = false)
    private boolean locked;

    private Instant emailVerifiedAt;
    private Instant updatedAt;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;
}

