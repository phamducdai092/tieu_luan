package com.web.study.party.api.user;

import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.pagination.PageMeta;
import com.web.study.party.dto.pagination.PageResponse;
import com.web.study.party.dto.request.user.UserInformationUpdateRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.auth.AuthResponse;
import com.web.study.party.dto.response.group.task.AttachmentDetailResponse;
import com.web.study.party.dto.response.user.UserInformationResponse;
import com.web.study.party.dto.response.user.UserSearchResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.attachment.AttachmentService;
import com.web.study.party.services.user.UserServiceImp;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import com.web.study.party.utils.filters.UserFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImp userService;
    private final UserMapper userMapper;
    private final AttachmentService attachmentService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserSearchResponse>>> searchUsers(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "displayName:asc") String sort,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);
        Page<UserSearchResponse> result = userService.searchUsers(keyword, pageable);

        return UserFilter.filterUsers(req, result);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserInformationResponse>> getUserProfile(
            @PathVariable Long userId,
            HttpServletRequest req
    ) {
        UserInformationResponse user = userService.getUserById(userId);

        return ResponseEntity.ok(ApiResponse.<UserInformationResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .message("Lấy thông tin người dùng thành công")
                .data(user)
                .path(req.getRequestURI())
                .build());
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
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .data(authResponse)
                .message("Lấy thông tin người dùng thành công")
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserInformationResponse>> updateUserInformation(@AuthenticationPrincipal(expression = "user")
                                                                                      Users user, @Valid @RequestBody UserInformationUpdateRequest request, HttpServletRequest httpRequest) {

        UserInformationResponse userInformationUpdateResponse = userService.updateUser(user.getId(), request);

        var response = ApiResponse.<UserInformationResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .data(userInformationUpdateResponse)
                .message("Cập nhật thông tin người dùng thành công!")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/attachments")
    public ResponseEntity<ApiResponse<List<AttachmentDetailResponse>>> getMyAttachments(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "uploadedAt") String sort,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        // Gọi Service
        PageResponse<AttachmentDetailResponse> result = attachmentService.getMyAttachments(user.getId(), pageable);

        return ResponseUtil.page(result.getData(), result.getMeta(), "Lấy danh sách file cá nhân thành công", req);
    }
}
