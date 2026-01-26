package com.web.study.party.api.admin;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.admin.AdminDashboardResponse;
import com.web.study.party.dto.response.admin.AdminFileResponse;
import com.web.study.party.dto.response.admin.AdminGroupResponse;
import com.web.study.party.dto.response.admin.AdminUserResponse;
import com.web.study.party.services.admin.AdminServiceImp;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.filters.AdminFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminServiceImp adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse stats = adminService.getAdminDashboardStats();
        ApiResponse<AdminDashboardResponse> response = ApiResponse.<AdminDashboardResponse>builder()
                .data(stats)
                .message("Admin dashboard statistics retrieved successfully.")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getUserInformation(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String order,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sortBy);
        var result = adminService.getAllUsers(keyword, pageable);

        return AdminFilter.filterUserResponses(req, result, order);
    }

    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<List<AdminGroupResponse>>> getGroupInformation(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String order,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sortBy);
        var result = adminService.getAllGroups(keyword, pageable);
        return AdminFilter.filterGroupResponses(req, result, order);
    }

    @GetMapping("/files")
    public ResponseEntity<ApiResponse<List<AdminFileResponse>>> getFileInformation(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String order,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sortBy);
        var result = adminService.getAllFiles(keyword, pageable);
        return AdminFilter.filterFileResponses(req, result, order);
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long userId) {
        adminService.toggleUserStatus(userId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("User status updated successfully.")
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/groups/{groupId}/status")
    public ResponseEntity<ApiResponse<Void>> toggleGroupStatus(@PathVariable Long groupId) {
        adminService.toggleGroupStatus(groupId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Group status updated successfully.")
                .build();
        return ResponseEntity.ok(response);
    }

}
