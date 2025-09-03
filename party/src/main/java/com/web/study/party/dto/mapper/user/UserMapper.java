package com.web.study.party.dto.mapper.user;


import com.web.study.party.dto.user.UserDTO;
import com.web.study.party.entities.Users;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(Users user);
    Users toEntity(UserDTO userDTO);
}
