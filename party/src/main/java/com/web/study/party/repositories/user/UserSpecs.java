package com.web.study.party.repositories.user;

import com.web.study.party.entities.Users;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {

    public static Specification<Users> isVerified() {
        return (root, query, cb) -> cb.isTrue(root.get("verified"));
    }

    // Tìm trong cả Email hoặc Tên
    public static Specification<Users> containsKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("displayName")), pattern)
            );
        };
    }
}