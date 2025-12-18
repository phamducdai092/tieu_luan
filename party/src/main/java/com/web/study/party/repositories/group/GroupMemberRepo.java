package com.web.study.party.repositories.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.MemberState;
import com.web.study.party.entities.group.GroupMembers;
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
public interface GroupMemberRepo extends JpaRepository<GroupMembers, Long> {

  boolean existsByGroupIdAndUserId(Long groupId, Long userId);

  Optional<GroupMembers> findByGroupIdAndUserId(Long gid, Long uid);

  int countByGroupIdAndState(Long gid, MemberState state);

  Optional<GroupMembers> findByGroupAndUserId(StudyGroups group, Long userId);

  Page<GroupMembers> findByGroupIdAndState(Long gid, MemberState state, Pageable p);

  @Query("SELECT m.user FROM GroupMembers m WHERE m.group.id = :groupId AND (m.role = 'MOD' OR m.role = 'OWNER')")
  List<Users> findModsAndOwner(@Param("groupId") Long groupId);

  @Query("SELECT m.user FROM GroupMembers m WHERE m.group.slug = :slug AND m.role = 'MOD'")
  List<Users> findModsBySlug(String slug);
}