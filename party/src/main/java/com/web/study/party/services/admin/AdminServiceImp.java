package com.web.study.party.services.admin;

import com.web.study.party.dto.mapper.group.task.AttachmentMapper;
import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.response.admin.AdminDashboardResponse;
import com.web.study.party.dto.response.admin.AdminFileResponse;
import com.web.study.party.dto.response.admin.AdminGroupResponse;
import com.web.study.party.dto.response.admin.AdminUserResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.AccountStatus;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.repositories.user.UserRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.repositories.group.GroupSpecs;
import com.web.study.party.repositories.attachment.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminServiceImp implements AdminService {

    private final UserRepo userRepo;
    private final GroupRepo groupRepo;
    private final AttachmentRepository attachmentRepo;

    private final UserMapper userMapper;
    private final AttachmentMapper attachmentMapper;

    @Override
    public long countTotalUsers() {
        return userRepo.count();
    }

    @Override
    public long countTotalGroups() {
        return groupRepo.count();
    }

    @Override
    public long countTotalFiles() {
        return attachmentRepo.count();
    }

    @Override
    public long countNewUsersToday() {
        Instant startOfDay = LocalDate.now().atStartOfDay().toInstant(java.time.ZoneOffset.UTC);
        return userRepo.countByEmailVerifiedAtAfter(startOfDay);
    }

    @Override
    public long countNewGroupsToday() {
        Instant startOfDay = LocalDate.now().atStartOfDay().toInstant(java.time.ZoneOffset.UTC);
        return groupRepo.countByCreatedAtAfter(startOfDay);
    }

    @Override
    public AdminDashboardResponse getAdminDashboardStats() {
        return AdminDashboardResponse.builder()
                .totalUsers(countTotalUsers())
                .totalGroups(countTotalGroups())
                .totalFiles(countTotalFiles())
                .newUsersToday(countNewUsersToday())
                .newGroupsToday(countNewGroupsToday())
                .build();
    }

    @Override
    public Page<AdminUserResponse> getAllUsers(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return userRepo.findByEmailContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(keyword, keyword, pageable);
        }
        return userRepo.findAll(pageable).map(userMapper::toAdminUserResponse);
    }

    @Override
    public void toggleUserStatus(Long userId) {
        Users user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        AccountStatus currentStatus = user.getAccountStatus();
        if (currentStatus == AccountStatus.ACTIVE) {
            user.setAccountStatus(AccountStatus.DEACTIVATED);
        } else {
            user.setAccountStatus(AccountStatus.ACTIVE);
        }
        userRepo.save(user);
    }

    @Override
    public Page<AdminGroupResponse> getAllGroups(String keyword, Pageable pageable) {
        Specification<StudyGroups> spec = GroupSpecs.nameContains(keyword);

        return groupRepo.findAll(spec, pageable)
                // AdminGroupResponse có constructor nhận Entity thì map thẳng, hoặc dùng mapper
                .map(group -> new AdminGroupResponse(
                        group.getId(), group.getName(), group.getSlug(),
                        group.getDescription(), group.getTopic(), group.getTopicColor(),
                        group.getMaxMembers(),
                        (long) group.getMemberCount(), // Count member
                        group.getOwner().getId(),
                        group.getCreatedAt(), group.isActive(), group.isDeleted()
                ));
    }

    @Override
    public void toggleGroupStatus(Long groupId) {
        StudyGroups group = groupRepo.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        boolean isActive = group.isActive();
        group.setActive(!isActive);
        groupRepo.save(group);
    }

    @Override
    public Page<AdminFileResponse> getAllFiles(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return attachmentRepo.findByFileNameContainingIgnoreCase(keyword, pageable);
        }
        return attachmentRepo.findAll(pageable).map(attachmentMapper::toAdminFileResponse);
    }
}
