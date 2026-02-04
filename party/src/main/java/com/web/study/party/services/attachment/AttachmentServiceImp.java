package com.web.study.party.services.attachment;

import com.web.study.party.dto.mapper.group.task.AttachmentMapper;
import com.web.study.party.dto.pagination.PageMeta;
import com.web.study.party.dto.pagination.PageResponse;
import com.web.study.party.dto.response.group.task.AttachmentDetailResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.task.Attachment;
import com.web.study.party.entities.task.Task;
import com.web.study.party.entities.task.TaskSubmission;
import com.web.study.party.repositories.group.task.AttachmentRepository;
import com.web.study.party.services.fileStorage.FileStorageService;
import com.web.study.party.utils.Helper;
import com.web.study.party.utils.PermissionChecker;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImp implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapper attachmentMapper;
    private final PermissionChecker permissionChecker;

    private final FileStorageService fileStorageService;

    @Override
    public void saveAttachments(List<MultipartFile> files, Task task, TaskSubmission submission, Users uploader) {
        if (files == null || files.isEmpty()) return;

        List<Attachment> list = new ArrayList<>();
        for (MultipartFile f : files) {
            String folder = (task != null) ? "tasks/" + task.getId() : "submissions/" + submission.getId();
            String url = fileStorageService.uploadFile(f, folder);

            Attachment att = new Attachment();
            att.setFileName(f.getOriginalFilename());
            att.setFilePath(url);
            att.setFileType(Helper.getExtension(f.getOriginalFilename()));
            att.setFileSize(f.getSize());
            att.setUploadedAt(Instant.now());
            att.setTask(task);
            att.setSubmission(submission);
            att.setUploadedBy(uploader);

            list.add(att);
        }
        attachmentRepository.saveAll(list);
    }

    @Override
    public PageResponse<AttachmentDetailResponse> getMyAttachments(Long userId, Pageable pageable) {
        Page<Attachment> pageResult = attachmentRepository.findAllByUploadedByIdAndIsDeletedFalse(userId, pageable);

        List<AttachmentDetailResponse> data = pageResult.map(attachmentMapper::toDetailResponse).getContent();
        // Map sang DTO
        PageMeta meta = PageMeta.builder()
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalItems(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                // Giả sử Paging.sortString là hàm util của m
                .sort(pageResult.getSort().toString())
                .build();

        return PageResponse.<AttachmentDetailResponse>builder()
                .data(data)
                .meta(meta)
                .build();
    }

    @Override
    public PageResponse<AttachmentDetailResponse> getAttachmentsByGroup(Long groupId, Long userId, Pageable pageable) {
        // 1. Check quyền
        permissionChecker.requireMember(userId, groupId);

        // 2. Query DB
        Page<Attachment> pageResult = attachmentRepository.findAllByGroupId(groupId, pageable);

        // 3. Map Data
        List<AttachmentDetailResponse> data = pageResult.map(attachmentMapper::toDetailResponse).getContent();

        // 4. Map Meta (Làm ngay tại Service)
        PageMeta meta = PageMeta.builder()
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalItems(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                // Giả sử Paging.sortString là hàm util của m
                .sort(pageResult.getSort().toString())
                .build();

        // 5. Đóng gói trả về
        return PageResponse.<AttachmentDetailResponse>builder()
                .data(data)
                .meta(meta)
                .build();
    }
}
