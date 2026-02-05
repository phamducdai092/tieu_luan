package com.web.study.party.repositories.group.invite;

import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.GroupInvite;
import org.springframework.data.jpa.domain.Specification;

public class GroupInviteSpecs {

    // 1. Lọc theo Group ID (Dùng cho Admin nhóm xem danh sách)
    public static Specification<GroupInvite> hasGroupId(Long groupId) {
        return (root, query, cb) -> cb.equal(root.get("group").get("id"), groupId);
    }

    // 2. Lọc theo Invitee ID (Dùng cho User xem lời mời của mình)
    public static Specification<GroupInvite> hasInviteeId(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("invitee").get("id"), userId);
    }

    // 3. Lọc Status (Chung)
    public static Specification<GroupInvite> hasStatus(RequestStatus status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    // 4. Keyword cho Group View (Tìm tên/email người được mời)
    public static Specification<GroupInvite> searchForGroup(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%";

            // Join bảng Invitee
            return cb.or(
                    cb.like(cb.lower(root.get("invitee").get("displayName")), likePattern),
                    cb.like(cb.lower(root.get("invitee").get("email")), likePattern)
            );
        };
    }

    // 5. Keyword cho User View (Tìm tên nhóm hoặc người mời)
    public static Specification<GroupInvite> searchForUser(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%";

            // Join bảng Group và Inviter
            return cb.or(
                    cb.like(cb.lower(root.get("group").get("name")), likePattern),
                    cb.like(cb.lower(root.get("inviter").get("displayName")), likePattern)
            );
        };
    }
}
