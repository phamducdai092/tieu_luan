package com.web.study.party.entities.group;

import com.web.study.party.entities.enums.MemberRole;
import com.web.study.party.entities.enums.MemberState;
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
    private Long groupId;
    private Long userId;

    @Enumerated(EnumType.STRING)
    MemberRole role = MemberRole.MEMBER;
    @Enumerated(EnumType.STRING)
    MemberState state = MemberState.APPROVED;

    Instant joinedAt = Instant.now();
}
