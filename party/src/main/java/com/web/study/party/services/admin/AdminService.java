package com.web.study.party.services.admin;

import com.web.study.party.dto.response.admin.AdminDashboardResponse;
import com.web.study.party.dto.response.admin.AdminFileResponse;
import com.web.study.party.dto.response.admin.AdminGroupResponse;
import com.web.study.party.dto.response.admin.AdminUserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface AdminService {
    long countTotalUsers();
    long countTotalGroups();
    long countTotalFiles();
    long countNewUsersToday();
    long countNewGroupsToday();

    AdminDashboardResponse getAdminDashboardStats();
    Page<AdminUserResponse> getAllUsers(String keyword, Pageable pageable);
    void toggleUserStatus(Long userId);
    Page<AdminGroupResponse> getAllGroups(String keyword, Pageable pageable);
    void toggleGroupStatus(Long groupId);
    Page<AdminFileResponse> getAllFiles(String keyword, Pageable pageable);
}
