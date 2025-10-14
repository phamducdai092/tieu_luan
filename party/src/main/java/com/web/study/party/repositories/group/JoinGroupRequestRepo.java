package com.web.study.party.repositories.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.JoinGroupRequest;
import com.web.study.party.entities.group.StudyGroups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface JoinGroupRequestRepo extends JpaRepository<JoinGroupRequest, Long> {
    List<JoinGroupRequest> findByGroupAndStatus(StudyGroups group, RequestStatus status);
    boolean existsByGroupAndUserAndStatus(StudyGroups group, Users user, RequestStatus status);
}
