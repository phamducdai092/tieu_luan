package com.web.study.party.dto.mapper.group.task;

import com.web.study.party.dto.response.admin.AdminFileResponse;
import com.web.study.party.dto.response.group.task.AttachmentResponse;
import com.web.study.party.entities.task.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AttachmentMapper {
    Attachment toEntity(AttachmentResponse resp);

    @Mapping(target = "fileUrl", source = "att.filePath")
    @Mapping(target = "uploadedById", source = "att.uploadedBy.id")
    AttachmentResponse toResponse(Attachment att);

    @Mapping(target = "fileUrl", source = "att.filePath")
    @Mapping(target = "uploadedById", source = "att.uploadedBy.id")
    AdminFileResponse toAdminFileResponse(Attachment att);
}
