package com.web.study.party.dto.mapper.enums;

public record EnumItemDTO(
        String code,
        String label,
        String description,
        String color,
        String icon,
        int order,
        boolean active
) {
}
