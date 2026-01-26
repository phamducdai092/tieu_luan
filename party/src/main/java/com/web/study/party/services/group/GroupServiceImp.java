package com.web.study.party.services.group;

import com.web.study.party.dto.mapper.group.GroupMapper;
import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.request.group.GroupCreateRequest;
import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.dto.response.group.GroupDetailResponse;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.dto.response.user.UserBrief;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.GroupPrivacy;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.MemberState;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.exception.BusinessException;
import com.web.study.party.exception.ResourceNotFoundException;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.utils.PermissionChecker;
import com.web.study.party.utils.slug.Slugger;
import com.web.study.party.utils.socket.SocketConst;
import com.web.study.party.utils.socket.SocketNotify;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImp implements GroupService {
    private final UserRepo userRepo;
    private final GroupRepo groupRepo;
    private final GroupMemberRepo memberRepo;
    private final GroupMapper groupMapper;
    private final UserMapper userMapper;
    private final Slugger slugger;
    private final PermissionChecker perm;
    private final GroupMemberRepo groupMemberRepo;

    @Override
    public Page<GroupResponse> getAllByUserId(Long uid) {
        return null;
    }

    @Override
    public Page<GroupResponse> getAll() {
        return null;
    }

    @Override
    public Page<GroupCardResponse> getJoinedGroups(Long userId, Pageable pageable) {
        var page = groupRepo.findJoinedGroupCards(userId, pageable);
        return page.map(groupMapper::toCardResponse);
    }

    @Override
    public Page<GroupCardResponse> getOwnedGroups(Long userId, Pageable pageable) {
        var page = groupRepo.findOwnedGroupCards(userId, pageable);
        return page.map(groupMapper::toCardResponse);
    }

    @Override
    public Page<GroupCardResponse> getDiscoverGroups(Long userId, Pageable pageable) {
        return groupRepo.findDiscoverGroupCards(userId, pageable)
                .map(groupMapper::toCardResponse);
    }

    @Override
    public GroupDetailResponse getDetailBySlug(String slug, Users currentUser) {

        StudyGroups group = getStudyGroup(slug);

        UserBrief ownerResponse = userMapper.toUserBrief(group.getOwner());

        int memberCount = groupMemberRepo.countByGroupIdAndState(group.getId(), MemberState.APPROVED);

        MemberRole currentUserRole = MemberRole.GUEST;

        if (currentUser != null) {
            // Nếu user đã đăng nhập, tìm role trong DB
            var memberOpt = groupMemberRepo.findByGroupAndUserId(group, currentUser.getId());

            if (memberOpt.isPresent()) {
                currentUserRole = memberOpt.get().getRole();
            }
        }

        if (group.getGroupPrivacy() == GroupPrivacy.PRIVATE) {
            if (currentUser == null) {
                throw new AccessDeniedException("Bạn phải đăng nhập để xem nhóm này.");
            }
            // Nếu là Private và không tìm thấy role trong DB (GUEST) -> Chặn
            if (currentUserRole == MemberRole.GUEST) {
                throw new AccessDeniedException("Đây là nhóm riêng tư. Bạn không phải là thành viên.");
            }
        }

        System.out.println("User: " + (currentUser != null ? currentUser.getEmail() : "Guest") + " - Role: " + currentUserRole);

        return new GroupDetailResponse(
                group.getId(),
                group.getName(),
                group.getSlug(),
                group.getDescription(),
                group.getTopic(),
                group.getTopicColor(),
                group.getMaxMembers(),
                memberCount,
                group.getGroupPrivacy(),
                group.getJoinPolicy(),
                ownerResponse,
                currentUserRole
        );
    }

    @Cacheable(value = "group_entities", key = "#slug")
    public StudyGroups getStudyGroup(String slug) {
        return groupRepo.findStudyGroupsBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng với slug: " + slug));
    }

    @Override
    @Transactional
    public GroupResponse create(Long uid, GroupCreateRequest req) {

        Users owner = userRepo.findById(uid).orElseThrow(() -> BusinessException.notFound("Không tìm thấy người dùng"));

        StudyGroups g = groupMapper.toEntity(req);
        g.setSlug(slugger.toSlug(req.name()));
        g.setOwner(owner);
        g.setCreatedAt(Instant.now());

        StudyGroups saved = groupRepo.save(g);
        saved.setSlug(slugger.toIdSlug(saved.getId(), saved.getName()));
        groupRepo.save(saved);

        memberRepo.save(new GroupMembers(null, g, owner, MemberRole.OWNER, MemberState.APPROVED, Instant.now()));
        return groupMapper.toResponse(saved, 1);
    }

    @Override
    @Transactional
    @CacheEvict(value = "group_entities", key = "#slug")
    @SocketNotify(
            topic = "'" + SocketConst.PREFIX_TOPIC_ROOM + "' + #result.slug",
            type = SocketConst.EVENT_ROOM_UPDATED
    )
    public GroupResponse update(Long uid, String slug, GroupCreateRequest req) {

        StudyGroups g = groupRepo.findStudyGroupBySlug(slug).orElseThrow(() -> BusinessException.notFound("Group not found"));
        Long gid = g.getId();

        perm.requireMod(uid, gid); // OWNER/MOD
        groupMapper.update(g, req);
        g.setUpdatedAt(Instant.now());

        int count = memberRepo.countByGroupIdAndState(gid, MemberState.APPROVED);

        return groupMapper.toResponse(g, count);
    }

    @Transactional
    public void delete(Long uid, String slug) {
        StudyGroups g = groupRepo.findStudyGroupBySlug(slug).orElseThrow(() -> BusinessException.notFound("Group not found"));
        Long gid = g.getId();
        perm.requireOwner(uid, gid);
        List<GroupMembers> gms = memberRepo.findAllByGroupId(gid);
        for(GroupMembers gm : gms ) {
            gm.setState(MemberState.LEFT);
        }
        groupMemberRepo.saveAll(gms);
        g.setDeleted(true);
        groupRepo.save(g);
    }
}
