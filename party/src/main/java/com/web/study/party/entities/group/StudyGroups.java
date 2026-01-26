package com.web.study.party.entities.group;

import com.web.study.party.entities.message.GroupMessages;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.GroupPrivacy;
import com.web.study.party.entities.enums.group.GroupTopic;
import com.web.study.party.entities.enums.group.JoinPolicy;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "study_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyGroups {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Users owner;

    @Column(nullable = false, length = 60)
    private String name;
    @Column(nullable = false, unique = true, length = 80)
    private String slug;
    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    private GroupTopic topic;
    private String topicColor;

    private Integer maxMembers = 100;

    private Instant createdAt;
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    JoinPolicy joinPolicy = JoinPolicy.OPEN;

    @Enumerated(EnumType.STRING)
    GroupPrivacy groupPrivacy = GroupPrivacy.PUBLIC;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "group", cascade = CascadeType.ALL)
    private List<GroupMessages> messages;

    @Builder.Default
    @Column(columnDefinition = "boolean default true")
    private boolean active = true;

    @Builder.Default
    private boolean deleted = false;
}

