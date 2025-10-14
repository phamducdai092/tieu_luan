package com.web.study.party.repositories;

import com.web.study.party.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {
    Optional<Users> findById(Long id);
    Optional<List<Users>> getAllByDisplayName(String displayName);
    boolean existsByEmail(String email);
    Optional<Users> findByEmail(String email);
}
