package com.web.study.party.repositories.group;

import com.web.study.party.entities.enums.group.GroupPrivacy;
import com.web.study.party.entities.enums.group.MemberState;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.group.StudyGroups;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class GroupSpecs {

    // 1. Lego: Lọc theo Owner (Danh sách nhóm tôi quản lý)
    public static Specification<StudyGroups> isOwnedBy(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("owner").get("id"), userId);
    }

    // 2. Lego: Lọc theo thành viên (Danh sách nhóm tôi đã tham gia)
    public static Specification<StudyGroups> isJoinedBy(Long userId) {
        return (root, query, cb) -> {
            // Join bảng GroupMembers để check user có trong đó ko
            Join<StudyGroups, GroupMembers> members = root.join("members", JoinType.INNER);

            return cb.and(
                    cb.equal(members.get("user").get("id"), userId),
                    cb.equal(members.get("state"), MemberState.APPROVED)
            );
        };
    }

    // 3. Lego: Khám phá (Nhóm Public + Active + Chưa xóa + Tôi CHƯA tham gia + Tôi ko phải Owner)
    public static Specification<StudyGroups> isDiscoverableFor(Long userId) {
        return (root, query, cb) -> {
            // Điều kiện cơ bản
            var isPublic = cb.equal(root.get("groupPrivacy"), GroupPrivacy.PUBLIC);
            var isActive = cb.isTrue(root.get("active"));
            var notDeleted = cb.isFalse(root.get("deleted"));
            var notOwner = cb.notEqual(root.get("owner").get("id"), userId);

            // Subquery: Tìm ID các nhóm mà user ĐÃ tham gia
            assert query != null;
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<GroupMembers> subRoot = subquery.from(GroupMembers.class);
            subquery.select(subRoot.get("group").get("id"));
            subquery.where(cb.equal(subRoot.get("user").get("id"), userId));

            // Điều kiện: ID nhóm hiện tại KHÔNG nằm trong danh sách đã tham gia
            var notJoined = cb.not(root.get("id").in(subquery));

            return cb.and(isPublic, isActive, notDeleted, notOwner, notJoined);
        };
    }

    // 4. Lego: Search tên (cho Admin hoặc Search chung)
    public static Specification<StudyGroups> nameContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            return cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
        };
    }

    // 5. Lego: Cơ bản (Active & Not Deleted)
    public static Specification<StudyGroups> isActiveAndNotDeleted() {
        return (root, query, cb) -> cb.and(
                cb.isTrue(root.get("active")),
                cb.isFalse(root.get("deleted"))
        );
    }
}