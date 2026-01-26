package com.web.study.party.repositories.group;

import com.web.study.party.dto.response.admin.AdminGroupResponse;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.repositories.projection.GroupCardProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface GroupRepo extends JpaRepository<StudyGroups, Long>, JpaSpecificationExecutor<StudyGroups> {
    Optional<StudyGroups> findStudyGroupsBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<StudyGroups> findStudyGroupsBySlug(String slug, Pageable pageable);

    Optional<StudyGroups> findStudyGroupBySlug(String slug);

    Optional<StudyGroups> findStudyGroupById(Long id);

    @Query(value = """
            select
              g.id as id,
              g.name as name,
              g.slug as slug,
              cast(g.topic as string) as topic,
              g.topicColor as topicColor,
              g.maxMembers as maxMembers,
              g.updatedAt as updatedAt,
              (
                select count(m2.id)
                from GroupMembers m2
                where m2.group.id = g.id
                  and m2.state = com.web.study.party.entities.enums.group.MemberState.APPROVED
              ) as memberCount
            from StudyGroups g
            join GroupMembers m on m.group.id = g.id
            where m.user.id = :userId
              and m.state = com.web.study.party.entities.enums.group.MemberState.APPROVED
            group by g.id, g.name, g.slug, g.topic, g.topicColor, g.maxMembers, g.updatedAt
            """,
            countQuery = """
                    select count(distinct g.id)
                    from StudyGroups g
                    join GroupMembers m on m.group.id = g.id
                    where m.user.id = :userId
                      and m.state = com.web.study.party.entities.enums.group.MemberState.APPROVED
                    """
    )
    Page<GroupCardProjection> findJoinedGroupCards(@Param("userId") Long userId, Pageable pageable);

    @Query(value = """
            select
              g.id as id,
              g.name as name,
              g.slug as slug,
              str(g.topic) as topic,
              g.topicColor as topicColor,
              g.maxMembers as maxMembers,
              g.updatedAt as updatedAt,
              (
                select count(m2.id)
                from GroupMembers m2
                where m2.group.id = g.id
                  and m2.state = com.web.study.party.entities.enums.group.MemberState.APPROVED
              ) as memberCount
            from StudyGroups g
            where g.owner.id = :userId
            order by g.updatedAt desc
            """,
            countQuery = """
                      select count(g.id)
                      from StudyGroups g
                      where g.owner.id = :userId
                    """
    )
    Page<GroupCardProjection> findOwnedGroupCards(@Param("userId") Long userId, Pageable pageable);

    long countByCreatedAtAfter(Instant createdAt);


    @Query("""
    SELECT new com.web.study.party.dto.response.admin.AdminGroupResponse(
        g.id,
        g.name,
        g.slug,
        g.description,
        g.topic,
        g.topicColor,
        g.maxMembers,
        COUNT(m.id),
        o.id,
        g.createdAt,
        g.active,
        g.deleted
    )
    FROM StudyGroups g
    LEFT JOIN g.owner o
    LEFT JOIN GroupMembers m ON m.group.id = g.id
                             AND m.state = com.web.study.party.entities.enums.group.MemberState.APPROVED
    WHERE (:nameKeyword IS NULL OR LOWER(g.name) LIKE LOWER(CONCAT('%', :nameKeyword, '%')))
    GROUP BY g.id, g.name, g.slug, g.description, g.topic, g.topicColor,
             g.maxMembers, o.id, g.createdAt, g.active, g.deleted
""")
    Page<AdminGroupResponse> findByNameContainingIgnoreCase(
            @Param("nameKeyword") String nameKeyword,
            Pageable pageable
    );

    @Query(value = """
            select
              g.id as id,
              g.name as name,
              g.slug as slug,
              cast(g.topic as string) as topic,
              g.topicColor as topicColor,
              g.maxMembers as maxMembers,
              g.updatedAt as updatedAt,
              (
                select count(m2.id)
                from GroupMembers m2
                where m2.group.id = g.id
                  and m2.state = com.web.study.party.entities.enums.group.MemberState.APPROVED
              ) as memberCount
            from StudyGroups g
            where g.owner.id != :userId
              and g.active = true
              and g.deleted = false
              and g.groupPrivacy = com.web.study.party.entities.enums.group.GroupPrivacy.PUBLIC
              and g.id not in (
                  select m.group.id
                  from GroupMembers m
                  where m.user.id = :userId
              )
            order by g.createdAt desc
            """,
            countQuery = """
                      select count(g.id)
                      from StudyGroups g
                      where g.owner.id != :userId
                        and g.active = true
                        and g.deleted = false
                        and g.groupPrivacy = com.web.study.party.entities.enums.group.GroupPrivacy.PUBLIC
                        and g.id not in (
                            select m.group.id
                            from GroupMembers m
                            where m.user.id = :userId
                        )
                    """
    )
    Page<GroupCardProjection> findDiscoverGroupCards(@Param("userId") Long userId, Pageable pageable);
}