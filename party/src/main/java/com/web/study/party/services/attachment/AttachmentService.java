package com.web.study.party.services.attachment;

import com.web.study.party.dto.pagination.PageResponse;
import com.web.study.party.dto.response.group.task.AttachmentDetailResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.task.Task;
import com.web.study.party.entities.task.TaskSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    void saveAttachments(List<MultipartFile> files, Task task, TaskSubmission submission, Users uploader);
    PageResponse<AttachmentDetailResponse> getMyAttachments(Long userId, Pageable pageable);
    PageResponse<AttachmentDetailResponse> getAttachmentsByGroup(Long groupId, Long userId, Pageable pageable);

}
