package com.web.study.party.repositories.user;

import com.web.study.party.dto.response.admin.AdminUserResponse;
import com.web.study.party.entities.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer>, JpaSpecificationExecutor<Users> {
    Optional<Users> findById(Long id);

    Optional<List<Users>> getAllByDisplayName(String displayName);

    boolean existsByEmail(String email);

    Optional<Users> findByEmail(String email);

    List<Users> findByIdIn(List<Long> ids);

    long countByEmailVerifiedAtAfter(Instant emailVerifiedAt);

    Page<AdminUserResponse> findByEmailContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(String emailKeyword, String displayNameKeyword, Pageable pageable);

}
