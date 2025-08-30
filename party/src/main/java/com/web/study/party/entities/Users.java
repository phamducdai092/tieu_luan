package com.web.study.party.entities;

import com.web.study.party.entities.enums.Role;
import com.web.study.party.entities.group.UserStudyGroup;
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
    private String displayName;

    @Column(name = "is_online",nullable = false)
    private boolean online;
    @Column(name= "is_verified", nullable = false)
    private boolean verified;
    @Column(name = "is_locked", nullable = false)
    private boolean locked;

    private Instant emailVerifiedAt;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<UserStudyGroup> studyGroups;
}

