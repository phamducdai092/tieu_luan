package com.web.study.party.dto.mapper.enums;

import com.web.study.party.entities.enums.EnumMeta;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public final class EnumMetaMapper {
    private EnumMetaMapper() {
    }

    public static <E extends Enum<E> & EnumMeta> EnumGroupDTO toGroupDTO(Class<E> enumClass) {
        List<EnumItemDTO> items = Arrays.stream(enumClass.getEnumConstants())
                .sorted((a, b) -> Integer.compare(a.getOrder(), b.getOrder()))
                .map(v -> new EnumItemDTO(
                        v.getCode(), v.getLabel(), v.getDescription(),
                        v.getColor(), v.getIcon(), v.getOrder(), v.isActive()
                ))
                .collect(Collectors.toList());
        return new EnumGroupDTO(enumClass.getSimpleName(), items);
    }
}
