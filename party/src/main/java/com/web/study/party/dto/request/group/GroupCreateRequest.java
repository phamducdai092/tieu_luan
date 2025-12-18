package com.web.study.party.dto.request.group;

import com.web.study.party.entities.enums.group.GroupPrivacy;
import com.web.study.party.entities.enums.group.GroupTopic;
import com.web.study.party.entities.enums.group.JoinPolicy;
import jakarta.validation.constraints.*;

public record GroupCreateRequest(
        @NotBlank @Size(max = 60) String name,
        @Size(max = 500) String description,
        @NotNull JoinPolicy joinPolicy,
        @NotNull GroupPrivacy groupPrivacy,
        @NotNull GroupTopic topic,
        @Min(2) @Max(200) Integer maxMembers
) {
}