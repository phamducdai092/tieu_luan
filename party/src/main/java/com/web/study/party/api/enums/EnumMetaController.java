package com.web.study.party.api.enums;

import com.web.study.party.dto.mapper.enums.EnumGroupDTO;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.enums.EnumsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/enums")
@RequiredArgsConstructor
public class EnumMetaController {

    private final EnumsService enumService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EnumGroupDTO>>> getEnums(@RequestParam(required = false) List<String> names, HttpServletRequest httpRequest) {

        ApiResponse<List<EnumGroupDTO>> response;
        List<EnumGroupDTO> data;
        if (names == null || names.isEmpty()) {
            // mặc định trả vài enum “phổ biến”
            data = enumService.getByNames(List.of(
                    "GroupPrivacy", "GroupTopic", "JoinPolicy", "MemberRole",  "MemberState", "RequestStatus", // group related
                    "AccountStatus", "Role" // account related
            ));
            response = ApiResponse.<List<EnumGroupDTO>>builder()
                    .status(CodeStatus.SUCCESS.getHttpCode())
                    .code(CodeStatus.SUCCESS.getMessage())
                    .path(httpRequest.getRequestURI())
                    .message("Lấy dữ liệu thành công")
                    .data(data)
                    .build();
        } else {
            data = enumService.getByNames(names);
            response = ApiResponse.<List<EnumGroupDTO>>builder()
                    .status(CodeStatus.SUCCESS.getHttpCode())
                    .code(CodeStatus.SUCCESS.getMessage())
                    .path(httpRequest.getRequestURI())
                    .message("Lấy dữ liệu thành công")
                    .data(data)
                    .build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/group-topic")
    public ResponseEntity<ApiResponse<EnumGroupDTO>> getGroupTopic(HttpServletRequest httpRequest) {
        EnumGroupDTO data = enumService.getGroupTopic();
        ApiResponse<EnumGroupDTO> response = ApiResponse.<EnumGroupDTO>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getMessage())
                .path(httpRequest.getRequestURI())
                .message("Lấy dữ liệu thành công")
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/member-role")
    public ResponseEntity<ApiResponse<EnumGroupDTO>> getMemberRole(HttpServletRequest httpRequest) {
        EnumGroupDTO data = enumService.getMemberRole();
        ApiResponse<EnumGroupDTO> response = ApiResponse.<EnumGroupDTO>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getMessage())
                .path(httpRequest.getRequestURI())
                .message("Lấy dữ liệu thành công")
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/account-status")
    public ResponseEntity<ApiResponse<EnumGroupDTO>> getAccountStatus(HttpServletRequest httpRequest) {
        EnumGroupDTO data = enumService.getAccountStatus();
        ApiResponse<EnumGroupDTO> response = ApiResponse.<EnumGroupDTO>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getMessage())
                .path(httpRequest.getRequestURI())
                .message("Lấy dữ liệu thành công")
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/member-state")
    public ResponseEntity<ApiResponse<EnumGroupDTO>> getMemberState(HttpServletRequest httpRequest) {
        EnumGroupDTO data = enumService.getMemberState();
        ApiResponse<EnumGroupDTO> response = ApiResponse.<EnumGroupDTO>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getMessage())
                .path(httpRequest.getRequestURI())
                .message("Lấy dữ liệu thành công")
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/join-policy")
    public ResponseEntity<ApiResponse<EnumGroupDTO>> getJoinPolicy(HttpServletRequest httpRequest
    ) {
        EnumGroupDTO data = enumService.getJoinPolicy();
        ApiResponse<EnumGroupDTO> response = ApiResponse.<EnumGroupDTO>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getMessage())
                .path(httpRequest.getRequestURI())
                .message("Lấy dữ liệu thành công")
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/role")
    public ResponseEntity<ApiResponse<EnumGroupDTO>> getRole(HttpServletRequest httpRequest) {
        EnumGroupDTO data = enumService.getRole();
        ApiResponse<EnumGroupDTO> response = ApiResponse.<EnumGroupDTO>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getMessage())
                .path(httpRequest.getRequestURI())
                .message("Lấy dữ liệu thành công")
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code-status")
    public ResponseEntity<ApiResponse<EnumGroupDTO>> getCodeStatus(HttpServletRequest httpRequest
    ) {
        EnumGroupDTO data = enumService.getCodeStatus();
        ApiResponse<EnumGroupDTO> response = ApiResponse.<EnumGroupDTO>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code(CodeStatus.SUCCESS.getMessage())
                .path(httpRequest.getRequestURI())
                .message("Lấy dữ liệu thành công")
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }

}
