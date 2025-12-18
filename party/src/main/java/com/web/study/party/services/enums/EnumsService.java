package com.web.study.party.services.enums;

import com.web.study.party.dto.mapper.enums.EnumGroupDTO;

import java.util.List;


public interface EnumsService {
    EnumGroupDTO getGroupPrivacy();

    EnumGroupDTO getGroupTopic();

    EnumGroupDTO getJoinPolicy();

    EnumGroupDTO getMemberRole();

    EnumGroupDTO getMemberState();

    EnumGroupDTO getRequestStatus();

    EnumGroupDTO getAccountStatus();

    EnumGroupDTO getRole();

    EnumGroupDTO getCodeStatus();

    List<EnumGroupDTO> getByNames(List<String> names);
}
