package com.web.study.party.repositories.group.joinRequest;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.JoinGroupRequest;
import com.web.study.party.entities.group.StudyGroups;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JoinGroupRequestRepo extends JpaRepository<JoinGroupRequest, Long>, JpaSpecificationExecutor<JoinGroupRequest> {

    Optional<JoinGroupRequest> findByGroupAndUserAndStatus(StudyGroups group, Users user, RequestStatus status);

    boolean existsByGroupAndUserAndStatus(StudyGroups group, Users user, RequestStatus status);
}
