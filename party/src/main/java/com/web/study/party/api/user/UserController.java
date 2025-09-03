package com.web.study.party.api.user;

import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.auth.AuthResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<List<Users>>> getAllUsers(HttpServletRequest req,
                                                                @RequestParam String username) {

        List<Users> users = userService.getAllUsersByName(username);

        return ResponseEntity.ok(
                ApiResponse.<List<Users>>builder()
                        .code(CodeStatus.SUCCESS.name())
                        .status(CodeStatus.SUCCESS.getCode())
                        .message("Users retrieved successfully")
                        .path(req.getRequestURI())
                        .data(users)
                        .build()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> me(
            @AuthenticationPrincipal(expression = "user")
            Users user,
            HttpServletRequest httpRequest) {

        if (user == null) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }

        var userDTO = userMapper.toDTO(user);
        var authResponse = new AuthResponse(null, null, null, userDTO);

        var response = ApiResponse.<AuthResponse>builder()
                .status(CodeStatus.SUCCESS.getCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .data(authResponse)
                .message("Lấy thông tin người dùng thành công")
                .build();

        return ResponseEntity.ok(response);
    }


}
