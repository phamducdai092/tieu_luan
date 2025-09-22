package com.web.study.party.entities.enums;

public interface EnumMeta {
    // code ổn định để FE submit (default = ENUM_NAME)
    default String getCode() {
        return ((Enum<?>) this).name();
    }

    // label hiển thị (default = ENUM_NAME)
    default String getLabel() {
        return ((Enum<?>) this).name();
    }

    // mô tả ngắn (default = "")
    default String getDescription() {
        return "";
    }

    // token màu FE (default = "gray")
    default String getColor() {
        return "gray";
    }

    // tên icon (default = "Circle")
    default String getIcon() {
        return "Circle";
    }

    // sort (default = 0)
    default int getOrder() {
        return 0;
    }

    // bật/tắt (default = true)
    default boolean isActive() {
        return true;
    }
}
