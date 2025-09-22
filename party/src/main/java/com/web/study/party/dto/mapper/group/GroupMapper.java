package com.web.study.party.dto.mapper.group;

import com.web.study.party.dto.request.group.GroupCreateRequest;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.entities.group.StudyGroups;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface GroupMapper {
    StudyGroups toEntity(GroupCreateRequest req);

    GroupResponse toResponse(StudyGroups g, Integer memberCount);

    // update partial
    void update(@MappingTarget StudyGroups g, GroupCreateRequest req);
}