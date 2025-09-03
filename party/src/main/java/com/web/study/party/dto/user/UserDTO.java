package com.web.study.party.dto.user;

import com.web.study.party.entities.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;

    private String email;

    private String avatarUrl;
    private String displayName;

    private boolean online;
    private boolean verified;
    private boolean locked;

    @Enumerated(EnumType.STRING)
    private Role role;

}
