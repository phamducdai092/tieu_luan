package com.web.study.party.entities.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.GroupRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_study_group")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "study_group_id")
    private StudyGroups studyGroup;

    @Enumerated(EnumType.STRING)
    private GroupRole role;
}
