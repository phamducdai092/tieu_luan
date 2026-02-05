package com.web.study.party.repositories.attachment;

import com.web.study.party.entities.task.Attachment;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class AttachmentSpecs {

    // Logic "Ma trận": Lấy file thuộc Group (dù nó nằm trong Task, Submission hay Chat)
    public static Specification<Attachment> belongsToGroup(Long groupId) {
        return (root, query, cb) -> {
            // Dùng Left Join để tránh lọt dữ liệu (vì file chỉ thuộc 1 trong 3 loại)
            var taskJoin = root.join("task", JoinType.LEFT);
            var subJoin = root.join("submission", JoinType.LEFT);
            // Lưu ý: Submission lại phải join tiếp lên Task để lấy groupId
            var subTaskJoin = subJoin.join("task", JoinType.LEFT); 
            var msgJoin = root.join("groupMessage", JoinType.LEFT);

            // Logic OR: (Task.groupId = id) OR (Submission.Task.groupId = id) OR (Msg.Group.id = id)
            return cb.or(
                    cb.equal(taskJoin.get("groupId"), groupId),
                    cb.equal(subTaskJoin.get("groupId"), groupId),
                    cb.equal(msgJoin.get("group").get("id"), groupId)
            );
        };
    }

    public static Specification<Attachment> isNotDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("isDeleted"));
    }
    
    public static Specification<Attachment> uploadedBy(Long userId) {
         return (root, query, cb) -> {
             if (userId == null) return null;
             // Giả sử có field uploadedBy hoặc join user
             return cb.equal(root.get("uploadedBy"), userId); 
         };
    }

    public static Specification<Attachment> fileNameContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            return cb.like(cb.lower(root.get("fileName")), "%" + keyword.toLowerCase() + "%");
        };
    }
}