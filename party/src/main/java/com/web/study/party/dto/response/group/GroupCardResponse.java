package com.web.study.party.dto.response.group;

import lombok.*;
import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupCardResponse {
    private Long id;
    private String name;
    private String slug;
    private String topic;
    private String topicColor;
    private Integer maxMembers;
    private Integer memberCount;
    private Instant updatedAt;
}
