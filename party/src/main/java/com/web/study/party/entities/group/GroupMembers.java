package com.web.study.party.entities.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.MemberState;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "group_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMembers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private StudyGroups group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    MemberRole role = MemberRole.MEMBER;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    MemberState state = MemberState.APPROVED;

    private Instant joinedAt = Instant.now();

}
