package com.web.study.party.services.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.MemberState;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.exeption.BusinessException;
import com.web.study.party.exeption.ResourceNotFoundException;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.utils.PermissionChecker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupMemberServiceImp implements GroupMemberService{

    private final UserRepo userRepo;
    private final GroupRepo groupRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final PermissionChecker perm;

    @Override
    public void addMember(Long groupId, Long userId) {
        StudyGroups group = groupRepo.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với ID: " + groupId));
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        if (groupMemberRepo.existsByGroupIdAndUserId(groupId, userId)) {
            // Có thể bỏ qua hoặc throw lỗi nếu muốn
            return;
        }

        GroupMembers newMember = GroupMembers.builder()
                .group(group)
                .user(user)
                .role(MemberRole.MEMBER)
                .state(MemberState.APPROVED)
                .build();
        groupMemberRepo.save(newMember);
    }

    @Transactional
    public void leave(Long uid, Long gid) {
        var m = groupMemberRepo.findByGroupIdAndUserId(gid, uid).orElseThrow(() -> BusinessException.notFound("Member not found"));
        if (m.getRole() == MemberRole.OWNER) throw new BusinessException("Owner must transfer ownership first");
        groupMemberRepo.delete(m);
    }

    @Override
    @Transactional
    public void kick(Long modId, Long gid, Long userId) {
        perm.requireMod(modId, gid);
        var m = groupMemberRepo.findByGroupIdAndUserId(gid, userId).orElseThrow(() -> BusinessException.notFound("Member not found"));
        if (m.getRole() == MemberRole.OWNER) throw new BusinessException("Can't kick owner");
        groupMemberRepo.delete(m);
    }

    @Override
    @Transactional
    public void setRole(Long ownerId, Long gid, Long userId, MemberRole role) {
        perm.requireOwner(ownerId, gid);
        var m = groupMemberRepo.findByGroupIdAndUserId(gid, userId).orElseThrow(() -> BusinessException.notFound("Member not found"));
        if (role == MemberRole.OWNER) throw new BusinessException("Use transferOwnership");
        m.setRole(role);
        groupMemberRepo.save(m);
    }

    @Override
    public void transferOwnership(Long ownerId, Long gid, Long newOwnerId) {
        perm.requireOwner(ownerId, gid);
        Users newOwner = userRepo.findById(newOwnerId).orElseThrow(() -> BusinessException.notFound("Không tìm thấy người dùng"));

        var old = groupMemberRepo.findByGroupIdAndUserId(gid, ownerId).orElseThrow(() -> BusinessException.notFound("Không tìm thấy chủ phòng hiện tại"));
        var neo = groupMemberRepo.findByGroupIdAndUserId(gid, newOwnerId).orElseThrow(() -> BusinessException.notFound("Không tìm thấy chủ phòng mới"));

        if (neo.getState() != MemberState.APPROVED) throw new BusinessException("Phải là thành viên của phòng học");

        old.setRole(MemberRole.MOD);
        neo.setRole(MemberRole.OWNER);

        var g = groupRepo.findById(gid).orElseThrow(() -> BusinessException.notFound("Group not found"));

        g.setOwner(newOwner);
        groupRepo.save(g);
        groupMemberRepo.saveAll(List.of(old, neo));
    }
}
