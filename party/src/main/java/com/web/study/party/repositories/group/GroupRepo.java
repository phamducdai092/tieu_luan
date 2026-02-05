package com.web.study.party.repositories.group;

import com.web.study.party.entities.group.StudyGroups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface GroupRepo extends JpaRepository<StudyGroups, Long>, JpaSpecificationExecutor<StudyGroups> {
    Optional<StudyGroups> findStudyGroupsBySlug(String slug);

    Optional<StudyGroups> findStudyGroupBySlug(String slug);

    Optional<StudyGroups> findStudyGroupById(Long id);

    long countByCreatedAtAfter(Instant createdAt);
}