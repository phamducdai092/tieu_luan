package com.web.study.party.repositories.group;

import com.web.study.party.entities.group.GroupInvite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupInviteRepo extends JpaRepository<GroupInvite, Long> {
  Optional<GroupInvite> findByToken(String token);
}