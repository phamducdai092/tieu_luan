package com.web.study.party.services.enums;

import com.web.study.party.dto.mapper.enums.EnumGroupDTO;
import com.web.study.party.dto.mapper.enums.EnumMetaMapper;
import com.web.study.party.entities.enums.*;
import com.web.study.party.entities.enums.group.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnumsServiceImp implements EnumsService {

    @Override
    public EnumGroupDTO getGroupPrivacy() {
        return EnumMetaMapper.toGroupDTO(GroupPrivacy.class);
    }

    @Override
    public EnumGroupDTO getGroupTopic() {
        return EnumMetaMapper.toGroupDTO(GroupTopic.class);
    }

    @Override
    public EnumGroupDTO getAccountStatus() {
        return EnumMetaMapper.toGroupDTO(AccountStatus.class);
    }

    @Override
    public EnumGroupDTO getMemberRole() {
        return EnumMetaMapper.toGroupDTO(MemberRole.class);
    }

    @Override
    public EnumGroupDTO getMemberState() {
        return EnumMetaMapper.toGroupDTO(MemberState.class);
    }

    @Override
    public EnumGroupDTO getRequestStatus() {
        return EnumMetaMapper.toGroupDTO(RequestStatus.class);
    }

    @Override
    public EnumGroupDTO getJoinPolicy() {
        return EnumMetaMapper.toGroupDTO(JoinPolicy.class);
    }

    @Override
    public EnumGroupDTO getRole() {
        return EnumMetaMapper.toGroupDTO(Role.class);
    }

    @Override
    public EnumGroupDTO getCodeStatus() {
        return EnumMetaMapper.toGroupDTO(CodeStatus.class);
    }

    public List<EnumGroupDTO> getByNames(List<String> names) {
        List<EnumGroupDTO> result = new ArrayList<>();
        for (String n : names) {
            switch (n) {
                case "GroupPrivacy" -> result.add(getGroupPrivacy());
                case "GroupTopic" -> result.add(getGroupTopic());
                case "JoinPolicy" -> result.add(getJoinPolicy());
                case "MemberRole" -> result.add(getMemberRole());
                case "MemberState" -> result.add(getMemberState());
                case "RequestStatus" -> result.add(getRequestStatus());
                case "AccountStatus" -> result.add(getAccountStatus());
                case "Role" -> result.add(getRole());
                case "CodeStatus" -> result.add(getCodeStatus());
                default -> {
                    throw new IllegalArgumentException("Unknown enum: " + n);
                }
            }
        }
        return result;
    }
}
