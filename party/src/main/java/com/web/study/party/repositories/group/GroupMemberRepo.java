package com.web.study.party.repositories.group;

import com.web.study.party.entities.enums.MemberState;
import com.web.study.party.entities.group.GroupMembers;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepo extends JpaRepository<GroupMembers, Long> {
  Optional<GroupMembers> findByGroupIdAndUserId(Long gid, Long uid);
  int countByGroupIdAndState(Long gid, MemberState state);
  List<GroupMembers> findByGroupIdAndState(Long gid, MemberState state, Pageable p);
}