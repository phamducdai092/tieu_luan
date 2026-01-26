package com.web.study.party.dto.response.user;

public record   UserSearchResponse(
        Long id,
        String email,
        String displayName,
        String avatarUrl
) {
}
