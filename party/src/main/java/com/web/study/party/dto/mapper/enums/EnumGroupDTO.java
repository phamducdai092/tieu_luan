package com.web.study.party.dto.mapper.enums;

public record EnumGroupDTO(
        String name,               // "GroupTopic"
        java.util.List<EnumItemDTO> items
) {
}