package com.web.study.party.entities.group;

import com.web.study.party.entities.ChatMessage;
import jakarta.persistence.*;
import lombok.*;
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

    private String groupName;

    private String description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "topic_id")
    private Topics topic;

    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL)
    private List<UserStudyGroup> members;

    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL)
    private List<ChatMessage> messages;
}

