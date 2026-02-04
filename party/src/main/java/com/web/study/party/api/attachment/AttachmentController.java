package com.web.study.party.api.attachment;

import com.web.study.party.dto.pagination.PageMeta;
import com.web.study.party.dto.pagination.PageResponse;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.task.AttachmentDetailResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.services.attachment.AttachmentService;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<List<AttachmentDetailResponse>>> getGroupAttachments(
            @PathVariable Long groupId,
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "uploadedAt") String sort,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        // 1. Gọi Service (Nhận về cục đã đóng gói sẵn)
        PageResponse<AttachmentDetailResponse> result = attachmentService.getAttachmentsByGroup(groupId, user.getId(), pageable);

        // 2. Trả về (Không cần build meta ở đây nữa)
        return ResponseUtil.page(result.getData(), result.getMeta(), "Lấy danh sách tài liệu thành công", req);
    }
}