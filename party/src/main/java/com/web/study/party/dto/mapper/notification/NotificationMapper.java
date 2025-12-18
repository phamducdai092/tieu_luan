package com.web.study.party.dto.mapper.notification;

import com.web.study.party.dto.response.notification.NotificationResponse;
import com.web.study.party.entities.Notification;
import com.web.study.party.dto.mapper.user.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface NotificationMapper {

    @Mapping(target = "recipient", source = "recipient")
    NotificationResponse toResponse(Notification entity);
}