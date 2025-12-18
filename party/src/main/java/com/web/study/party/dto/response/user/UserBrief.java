package com.web.study.party.dto.response.user;

public record UserBrief(
        Long id,
        String displayName,
        String avatarUrl
) {
}
