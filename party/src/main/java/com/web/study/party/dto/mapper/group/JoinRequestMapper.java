package com.web.study.party.dto.mapper.group;

import com.web.study.party.dto.response.group.JoinRequestResponse;
import com.web.study.party.entities.group.JoinGroupRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JoinRequestMapper {
    @Mapping(target = "user.id", source = "user.id")
    @Mapping(target = "user.displayName", source = "user.displayName")
    @Mapping(target = "user.avatarUrl", source = "user.avatarUrl")
    JoinRequestResponse toResponse(JoinGroupRequest entity);
}