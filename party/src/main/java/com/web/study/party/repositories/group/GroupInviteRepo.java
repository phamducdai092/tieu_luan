package com.web.study.party.repositories.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.GroupInvite;
import com.web.study.party.entities.group.StudyGroups;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupInviteRepo extends JpaRepository<GroupInvite, Long> {

    Optional<GroupInvite> findByToken(String token);

    boolean existsByGroupAndInviteeAndStatus(StudyGroups group, Users invitee, RequestStatus status);

    List<GroupInvite> findByGroupAndStatus(StudyGroups group, RequestStatus status);

    List<GroupInvite> findByInviteeAndStatus(Users invitee, RequestStatus status);

    @Query("SELECT i FROM GroupInvite i WHERE i.invitee.id = :userId " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:keyword IS NULL OR " +
           "lower(i.group.name) LIKE lower(concat('%', :keyword, '%')) OR " +
           "lower(i.inviter.displayName) LIKE lower(concat('%', :keyword, '%'))) ")
    Page<GroupInvite> findInvitationsForUser(@Param("userId") Long userId,
                                             @Param("status") RequestStatus status,
                                             @Param("keyword") String keyword,
                                             Pageable pageable);

    @Query("SELECT i FROM GroupInvite i WHERE i.group.id = :groupId " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:keyword IS NULL OR " +
           "lower(i.invitee.displayName) LIKE lower(concat('%', :keyword, '%')) OR " +
           "lower(i.invitee.email) LIKE lower(concat('%', :keyword, '%'))) ")
    Page<GroupInvite> findInvitationsForGroup(@Param("groupId") Long groupId,
                                              @Param("status") RequestStatus status,
                                              @Param("keyword") String keyword,
                                              Pageable pageable);
}