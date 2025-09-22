package com.web.study.party.repositories.projection;

import java.time.Instant;

public interface GroupCardProjection {
    Long getId();
    String getName();
    String getSlug();
    String getTopic();      // sẽ cast enum -> string (JPQL select g.topic)
    String getTopicColor();
    Integer getMaxMembers();
    Instant getUpdatedAt();
    Integer getMemberCount();
}
