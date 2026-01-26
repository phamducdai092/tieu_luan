package com.web.study.party.dto.request.group.task;

import jakarta.validation.constraints.*;
import java.util.List;

public record AssignUsersRequest(
    @NotEmpty(message = "Danh sách user không được trống")
    @Size(max = 5, message = "Tối đa 5 người")
    List<@NotNull Long> userIds
) {}