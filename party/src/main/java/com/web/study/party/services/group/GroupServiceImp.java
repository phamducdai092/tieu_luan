package com.web.study.party.services.group;

import com.web.study.party.dto.mapper.group.GroupCardMapper;
import com.web.study.party.dto.mapper.group.GroupMapper;
import com.web.study.party.dto.request.group.GroupCreateRequest;
import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.MemberState;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.exeption.BusinessException;
import com.web.study.party.repositories.UserRepo;
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
    private final UserRepo userRepo;
    private final GroupRepo groupRepo;
    private final GroupMemberRepo memberRepo;
    private final GroupMapper mapper;
    private final Slugger slugger; // util tạo slug unique
    private final PermissionChecker perm; // util check role
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
        return page.map(GroupCardMapper::toDto);
    }

    @Override
    public Page<GroupCardResponse> getOwnedGroups(Long userId, Pageable pageable) {
        var page = groupRepo.findOwnedGroupCards(userId, pageable);
        return page.map(GroupCardMapper::toDto);
    }

    @Transactional
    public GroupResponse create(Long uid, GroupCreateRequest req) {

        Users owner = userRepo.findById(uid).orElseThrow(() -> BusinessException.notFound("Không tìm thấy người dùng"));

        StudyGroups g = mapper.toEntity(req);
        g.setSlug(slugger.toSlug(req.name()));
        g.setOwner(owner);
        g.setCreatedAt(Instant.now());

        StudyGroups saved = groupRepo.save(g);
        saved.setSlug(slugger.toIdSlug(saved.getId(), saved.getName()));
        groupRepo.save(saved);

        memberRepo.save(new GroupMembers(null, g, owner, MemberRole.OWNER, MemberState.APPROVED, Instant.now()));
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

}
