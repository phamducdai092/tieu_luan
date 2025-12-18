package com.web.study.party.dto.mapper.group;

import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.dto.response.group.JoinRequestResponse;
import com.web.study.party.dto.response.user.UserJoinRequestResponse;
import com.web.study.party.entities.group.JoinGroupRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JoinRequestMapper {
    @Mapping(target = "user.id", source = "user.id")
    @Mapping(target = "user.displayName", source = "user.displayName")
    @Mapping(target = "user.avatarUrl", source = "user.avatarUrl")
    @Mapping(target = "requestId", source = "id")
    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "resolver.id", source = "resolver.id")
    @Mapping(target = "resolver.displayName", source = "resolver.displayName")
    @Mapping(target = "resolver.avatarUrl", source = "resolver.avatarUrl")
    @Mapping(target = "owner.id", source = "group.owner.id")
    @Mapping(target = "owner.displayName", source = "group.owner.displayName")
    @Mapping(target = "owner.avatarUrl", source = "group.owner.avatarUrl")
    JoinRequestResponse toResponse(JoinGroupRequest entity);

    @Mapping(target = "groupResponse", source = "groupResponse")
    @Mapping(target = "joinRequestResponse", source = "joinRequestResponse")
    UserJoinRequestResponse toUserJoinRequestResponse(JoinRequestResponse joinRequestResponse, GroupResponse groupResponse);
}