package com.web.study.party.services.group;

import com.web.study.party.dto.mapper.group.GroupCardMapper;
import com.web.study.party.dto.mapper.group.GroupMapper;
import com.web.study.party.dto.request.group.GroupCreateRequest;
import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.entities.enums.MemberRole;
import com.web.study.party.entities.enums.MemberState;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.exeption.BusinessException;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.utils.PermissionChecker;
import com.web.study.party.utils.slug.Slugger;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GroupServiceImp implements GroupService {
    private final GroupRepo groupRepo;
    private final GroupMemberRepo memberRepo;
    private final GroupMapper mapper;
    private final Slugger slugger; // util tạo slug unique
    private final PermissionChecker perm; // util check role

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
        return page.map(GroupCardMapper::toDto);
    }

    @Override
    public Page<GroupCardResponse> getOwnedGroups(Long userId, Pageable pageable) {
        var page = groupRepo.findOwnedGroupCards(userId, pageable);
        return page.map(GroupCardMapper::toDto);
    }

    @Transactional
    public GroupResponse create(Long uid, GroupCreateRequest req) {

        StudyGroups g = mapper.toEntity(req);
        g.setSlug(slugger.toSlug(req.name()));
        g.setOwnerId(uid);
        g.setCreatedAt(Instant.now());

        StudyGroups saved = groupRepo.save(g);
        saved.setSlug(slugger.toIdSlug(saved.getId(), saved.getName()));
        groupRepo.save(saved);

        memberRepo.save(new GroupMembers(null, saved.getId(), uid, MemberRole.OWNER, MemberState.APPROVED, Instant.now()));
        return mapper.toResponse(saved, 1);
    }

    @Transactional
    public GroupResponse update(Long uid, Long gid, GroupCreateRequest req) {

        StudyGroups g = groupRepo.findById(gid).orElseThrow(() -> BusinessException.notFound("Group not found"));
        perm.requireMod(uid, gid); // OWNER/MOD
        mapper.update(g, req);
        g.setUpdatedAt(Instant.now());
        if (!Objects.equals(g.getName(), req.name())) {
            g.setSlug(slugger.toIdSlug(g.getId(), req.name()));
        }
        groupRepo.save(g);
        int count = memberRepo.countByGroupIdAndState(gid, MemberState.APPROVED);
        return mapper.toResponse(g, count);
    }

    @Transactional
    public void delete(Long uid, Long gid) {
        perm.requireOwner(uid, gid);
        memberRepo.deleteAll(memberRepo.findAllById(List.of())); // rút gọn
        groupRepo.deleteById(gid);
    }

    @Transactional
    public String join(Long uid, Long gid) {

        StudyGroups g = groupRepo.findById(gid).orElseThrow(() -> BusinessException.notFound("Group not found"));

        if (memberRepo.countByGroupIdAndState(gid, MemberState.APPROVED) >= g.getMaxMembers())
            throw new BusinessException("Groups is full");

        var existing = memberRepo.findByGroupIdAndUserId(gid, uid);

        if (existing.isPresent() && existing.get().getState() == MemberState.APPROVED) return "Joined";

        if (existing.isPresent() && existing.get().getState() == MemberState.PENDING) return "Pending approval";

        String rs = switch (g.getJoinPolicy()) {
            case OPEN -> "Joined";
            case ASK -> "Pending approval";
            case INVITE_ONLY -> throw new BusinessException("Invite only");
        };

        MemberState st = switch (g.getJoinPolicy()) {
            case OPEN -> MemberState.APPROVED;
            case ASK -> MemberState.PENDING;
            case INVITE_ONLY -> throw new BusinessException("Invite only");
        };

        var m = existing.orElseGet(() -> new GroupMembers(null, gid, uid, MemberRole.MEMBER, st, Instant.now()));
        m.setState(st);

        memberRepo.save(m);

        return rs;
    }

    @Transactional
    public void leave(Long uid, Long gid) {
        var m = memberRepo.findByGroupIdAndUserId(gid, uid).orElseThrow(() -> BusinessException.notFound("Member not found"));
        if (m.getRole() == MemberRole.OWNER) throw new BusinessException("Owner must transfer ownership first");
        memberRepo.delete(m);
    }

    @Transactional
    public void approve(Long modId, Long gid, Long userId) {
        perm.requireMod(modId, gid);
        var m = memberRepo.findByGroupIdAndUserId(gid, userId).orElseThrow(() -> BusinessException.notFound("Member not found"));
        if (m.getState() != MemberState.PENDING) throw new BusinessException("Member is not pending");
        m.setState(MemberState.APPROVED);
        memberRepo.save(m);
    }

    @Transactional
    public void kick(Long modId, Long gid, Long userId) {
        perm.requireMod(modId, gid);
        var m = memberRepo.findByGroupIdAndUserId(gid, userId).orElseThrow(() -> BusinessException.notFound("Member not found"));
        if (m.getRole() == MemberRole.OWNER) throw new BusinessException("Can't kick owner");
        memberRepo.delete(m);
    }

    @Transactional
    public void setRole(Long ownerId, Long gid, Long userId, MemberRole role) {
        perm.requireOwner(ownerId, gid);
        var m = memberRepo.findByGroupIdAndUserId(gid, userId).orElseThrow(() -> BusinessException.notFound("Member not found"));
        if (role == MemberRole.OWNER) throw new BusinessException("Use transferOwnership");
        m.setRole(role);
        memberRepo.save(m);
    }

    @Transactional
    public void transferOwnership(Long ownerId, Long gid, Long newOwnerId) {
        perm.requireOwner(ownerId, gid);
        var old = memberRepo.findByGroupIdAndUserId(gid, ownerId).orElseThrow(() -> BusinessException.notFound("Current owner not found"));
        var neo = memberRepo.findByGroupIdAndUserId(gid, newOwnerId).orElseThrow(() -> BusinessException.notFound("New owner not found"));
        if (neo.getState() != MemberState.APPROVED) throw new BusinessException("New owner must be approved member");
        old.setRole(MemberRole.MOD);
        neo.setRole(MemberRole.OWNER);
        var g = groupRepo.findById(gid).orElseThrow(() -> BusinessException.notFound("Group not found"));
        g.setOwnerId(newOwnerId);
        groupRepo.save(g);
        memberRepo.saveAll(List.of(old, neo));
    }
}
