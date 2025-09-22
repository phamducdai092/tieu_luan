package com.web.study.party.services.enums;

import com.web.study.party.dto.mapper.enums.EnumGroupDTO;
import org.springframework.stereotype.Service;

import java.util.List;


public interface EnumsService {
    EnumGroupDTO getGroupTopic();
     EnumGroupDTO getAccountStatus();
     EnumGroupDTO getMemberRole();
     EnumGroupDTO getMemberState();
     EnumGroupDTO getJoinPolicy();
     EnumGroupDTO getRole();
     EnumGroupDTO getCodeStatus();
    List<EnumGroupDTO> getByNames(List<String> names);
}
