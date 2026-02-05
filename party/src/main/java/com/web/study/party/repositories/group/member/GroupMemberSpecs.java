package com.web.study.party.repositories.group.member;

import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.MemberState;
import com.web.study.party.entities.group.GroupMembers;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collection;

public class GroupMemberSpecs {

    // 1. Lọc theo Group ID
    public static Specification<GroupMembers> hasGroupId(Long groupId) {
        return (root, query, cb) -> cb.equal(root.get("group").get("id"), groupId);
    }

    // 2. Lọc theo Group Slug (Dùng khi tìm Mod theo slug)
    public static Specification<GroupMembers> hasGroupSlug(String slug) {
        return (root, query, cb) -> cb.equal(root.get("group").get("slug"), slug);
    }

    // 3. Lọc theo State (APPROVED, PENDING...)
    public static Specification<GroupMembers> hasState(MemberState state) {
        return (root, query, cb) -> {
            if (state == null) return null;
            return cb.equal(root.get("state"), state);
        };
    }

    // 4. Lọc theo Role cụ thể
    public static Specification<GroupMembers> hasRole(MemberRole role) {
        return (root, query, cb) -> {
            if (role == null) return null;
            return cb.equal(root.get("role"), role);
        };
    }

    // 5. Lọc theo danh sách Role (VD: Lấy cả MOD và OWNER)
    public static Specification<GroupMembers> hasRoleIn(Collection<MemberRole> roles) {
        return (root, query, cb) -> {
            if (roles == null || roles.isEmpty()) return null;
            return root.get("role").in(roles);
        };
    }

    // 6. Search Keyword (Tìm theo tên hiển thị hoặc email của User)
    public static Specification<GroupMembers> containsKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%";
            
            // Join bảng User
            return cb.or(
                    cb.like(cb.lower(root.get("user").get("displayName")), likePattern),
                    cb.like(cb.lower(root.get("user").get("email")), likePattern)
            );
        };
    }
}