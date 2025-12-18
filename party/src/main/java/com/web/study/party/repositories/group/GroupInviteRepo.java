package com.web.study.party.repositories.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.GroupInvite;
import com.web.study.party.entities.group.StudyGroups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupInviteRepo extends JpaRepository<GroupInvite, Long> {

    Optional<GroupInvite> findByToken(String token);

    boolean existsByGroupAndInviteeAndStatus(StudyGroups group, Users invitee, RequestStatus status);

    List<GroupInvite> findByGroupAndStatus(StudyGroups group, RequestStatus status);

    List<GroupInvite> findByInviteeAndStatus(Users invitee, RequestStatus status);
}