package com.web.study.party.repositories.group.joinRequest;

import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.JoinGroupRequest;
import org.springframework.data.jpa.domain.Specification;

public class JoinRequestSpecs {

    // 1. Lọc theo Group ID (Admin xem danh sách xin vào)
    public static Specification<JoinGroupRequest> hasGroupId(Long groupId) {
        return (root, query, cb) -> cb.equal(root.get("group").get("id"), groupId);
    }

    // 2. Lọc theo User ID (User xem lịch sử xin vào của mình)
    public static Specification<JoinGroupRequest> hasUserId(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    // 3. Lọc theo Status (PENDING, ACCEPTED...)
    public static Specification<JoinGroupRequest> hasStatus(RequestStatus status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    // 4. (Optional) Search Keyword (Tìm theo tên User hoặc tên Group)
    public static Specification<JoinGroupRequest> containsKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%";

            // Tìm theo tên hiển thị của User hoặc tên Group
            return cb.or(
                    cb.like(cb.lower(root.get("user").get("displayName")), likePattern),
                    cb.like(cb.lower(root.get("group").get("name")), likePattern)
            );
        };
    }
}