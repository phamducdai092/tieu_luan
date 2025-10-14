package com.web.study.party.service.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.group.JoinGroupRequest;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.exeption.ResourceNotFoundException;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.JoinGroupRequestRepo;
import com.web.study.party.services.group.GroupMemberService;
import com.web.study.party.services.group.JoinRequestServiceImp;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Kích hoạt Mockito
class JoinRequestServiceImplTest {

    @Mock // Tạo "diễn viên đóng thế" cho Repo
    private JoinGroupRequestRepo joinRequestRepo;
    @Mock
    private UserRepo userRepo;
    @Mock
    private GroupMemberRepo groupMemberRepo;
    @Mock // Tạo "diễn viên đóng thế" cho Service khác
    private GroupMemberService groupMemberService;

    @InjectMocks // Tự động inject các @Mock ở trên vào service này
    private JoinRequestServiceImp joinRequestService;

    @Test
    void approveJoinRequest_WhenSuccess_ShouldUpdateStatusAndAddMember() {
        // --- 1. GIVEN (Sắp xếp bối cảnh, "dạy" cho mock) ---
        Long requestId = 1L;
        Long adminId = 10L; // ID của MOD
        Long ownerId = 1L;   // ID của Owner
        Long requesterId = 20L; // ID của người xin vào
        Long groupId = 100L;

        // Tạo các đối tượng giả
        Users adminUser = Users.builder().id(adminId).build();
        Users ownerUser = Users.builder().id(ownerId).build();
        Users requesterUser = Users.builder().id(requesterId).build();

        StudyGroups group = StudyGroups.builder().id(groupId).owner(ownerUser).build();

        JoinGroupRequest request = JoinGroupRequest.builder()
                .id(requestId)
                .group(group)
                .user(requesterUser)
                .status(RequestStatus.PENDING)
                .build();

        // "Dạy" cho repo: khi findById(requestId), hãy trả về request giả ở trên
        when(joinRequestRepo.findById(requestId)).thenReturn(Optional.of(request));

        // "Dạy" cho repo: khi findById(adminId), hãy trả về adminUser giả
        when(userRepo.findById(adminId)).thenReturn(Optional.of(adminUser));

        // "Dạy" cho repo: khi kiểm tra quyền, hãy giả sử adminId này là MOD
        when(groupMemberRepo.findByGroupAndUserId(group, adminId))
                .thenReturn(Optional.of(GroupMembers.builder().role(MemberRole.MOD).build()));

        // --- 2. WHEN (Thực hiện hành động cần test) ---
        joinRequestService.approveJoinRequest(requestId, adminId);

        // --- 3. THEN (Kiểm tra kết quả) ---
        // Kiểm tra xem hàm save của repo có được gọi 1 lần hay không
        verify(joinRequestRepo, times(1)).save(request);

        // Kiểm tra xem hàm addMember của service có được gọi 1 lần với đúng groupId và userId không
        verify(groupMemberService, times(1)).addMember(groupId, requesterId);

        // Kiểm tra xem trạng thái của request đã được chuyển thành ACCEPTED chưa
        assertEquals(RequestStatus.ACCEPTED, request.getStatus());

        // Kiểm tra xem người duyệt có phải là adminUser không
        assertEquals(adminUser, request.getResolver());
    }

    @Test
    void approveJoinRequest_WhenRequestNotFound_ShouldThrowException() {
        // GIVEN
        Long requestId = 1L;
        Long adminId = 10L;
        when(joinRequestRepo.findById(requestId)).thenReturn(Optional.empty()); // Giả lập không tìm thấy request

        // WHEN & THEN
        // Kiểm tra xem có đúng là exception ResourceNotFoundException được ném ra không
        assertThrows(ResourceNotFoundException.class, () -> joinRequestService.approveJoinRequest(requestId, adminId));

        // Đảm bảo các hàm thêm member không bao giờ được gọi
        verify(groupMemberService, never()).addMember(any(), any());
    }

    // M có thể viết thêm các test case khác cho trường hợp không có quyền, request đã xử lý...
}