package com.web.study.party.repositories.group;

import com.web.study.party.dto.response.user.UserJoinRequestResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.JoinGroupRequest;
import com.web.study.party.entities.group.StudyGroups;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoinGroupRequestRepo extends JpaRepository<JoinGroupRequest, Long> {

    Optional<JoinGroupRequest> findByGroupAndUserAndStatus(StudyGroups group, Users user, RequestStatus status);

    Page<JoinGroupRequest> findByGroupAndStatus(StudyGroups group, RequestStatus status, Pageable pageable);

    Page<JoinGroupRequest> findByUser(Users user, Pageable pageable);

    boolean existsByGroupAndUserAndStatus(StudyGroups group, Users user, RequestStatus status);
}
