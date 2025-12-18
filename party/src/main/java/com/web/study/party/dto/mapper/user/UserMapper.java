package com.web.study.party.dto.mapper.user;


import com.web.study.party.dto.request.user.UserInformationUpdateRequest;
import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.dto.response.user.UserInformationResponse;
import com.web.study.party.dto.user.UserDTO;
import com.web.study.party.entities.Users;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(Users user);
    Users toEntity(UserDTO userDTO);
    UserInformationResponse toUserInformationResponse(Users user);
    UserBrief toUserBrief(Users user);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(@MappingTarget Users user, UserInformationUpdateRequest request);
}
