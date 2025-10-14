package com.web.study.party.services.group;

import com.web.study.party.dto.mapper.group.JoinRequestMapper;
import com.web.study.party.dto.response.group.JoinRequestResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.JoinPolicy;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.JoinGroupRequest;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.exeption.BadRequestException;
import com.web.study.party.exeption.ResourceNotFoundException;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.repositories.group.JoinGroupRequestRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JoinRequestServiceImp implements JoinRequestService {

    private final GroupRepo groupRepo;
    private final UserRepo userRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final JoinGroupRequestRepo joinRequestRepo;
    private final JoinRequestMapper joinRequestMapper;
    private final GroupMemberService groupMemberService;

    @Override
    @Transactional
    public void createJoinRequest(Long groupId, Long userId) {
        // B1: Tìm group và user. Dùng orElseThrow để bắn exception nếu không tìm thấy.
        StudyGroups group = groupRepo.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với ID: " + groupId));

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        // B2: Kiểm tra chính sách tham gia của nhóm.
        if (group.getJoinPolicy() != JoinPolicy.ASK) {
            throw new BadRequestException("Nhóm này không yêu cầu xét duyệt để tham gia.");
        }

        // B3: Kiểm tra xem user đã là thành viên chưa.
        boolean isAlreadyMember = groupMemberRepo.existsByGroupIdAndUserId(groupId, userId);
        if (isAlreadyMember) {
            throw new BadRequestException("Bạn đã là thành viên của nhóm này.");
        }

        // B4: Kiểm tra xem user đã gửi yêu cầu trước đó (đang PENDING) chưa.
        boolean hasPendingRequest = joinRequestRepo.existsByGroupAndUserAndStatus(group, user, RequestStatus.PENDING);
        if (hasPendingRequest) {
            throw new BadRequestException("Bạn đã gửi yêu cầu tham gia nhóm này rồi, vui lòng đợi duyệt.");
        }

        // B5: Tất cả kiểm tra hợp lệ -> Tạo yêu cầu mới.
        JoinGroupRequest newRequest = JoinGroupRequest.builder()
                .group(group)
                .user(user)
                .status(RequestStatus.PENDING) // Mặc định là PENDING
                .build();

        joinRequestRepo.save(newRequest);
    }

    @Override
    @Transactional
    public List<JoinRequestResponse> getJoinRequestsForGroup(Long groupId, Long ownerId) {
        StudyGroups group = groupRepo.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với ID: " + groupId));

        // Kiểm tra xem người dùng có phải là OWNER hoặc MOD không
        boolean hasPermission = group.getOwner().getId().equals(ownerId) ||
                groupMemberRepo.findByGroupAndUserId(group, ownerId)
                        .map(member -> member.getRole() == MemberRole.MOD) // Sửa ADMIN thành MOD
                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền xem danh sách yêu cầu của nhóm này.");
        }
        // --- KẾT THÚC ĐOẠN SỬA ---

        List<JoinGroupRequest> requests = joinRequestRepo.findByGroupAndStatus(group, RequestStatus.PENDING);

        return requests.stream()
                .map(joinRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveJoinRequest(Long requestId, Long ownerId) {
        // B1: Tìm và xác thực yêu cầu
        JoinGroupRequest request = findAndValidateRequest(requestId, ownerId);
        Users admin = userRepo.findById(ownerId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chủ phòng :" + ownerId));

        // B2: Cập nhật trạng thái yêu cầu
        request.setStatus(RequestStatus.ACCEPTED);
        request.setResolver(admin);
        request.setResolvedAt(Instant.now());

        // B4: Gọi GroupMemberService để thêm thành viên
        groupMemberService.addMember(request.getGroup().getId(), request.getUser().getId());

        joinRequestRepo.save(request);
    }

    @Override
    @Transactional
    public void rejectJoinRequest(Long requestId, Long ownerId) {
        // B1: Tìm và xác thực yêu cầu
        JoinGroupRequest request = findAndValidateRequest(requestId, ownerId);
        Users admin = userRepo.findById(ownerId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chủ phòng :" + ownerId));

        // B2: Cập nhật trạng thái
        request.setStatus(RequestStatus.DECLINED);
        request.setResolver(admin);
        request.setResolvedAt(Instant.now());

        joinRequestRepo.save(request);
    }

    private JoinGroupRequest findAndValidateRequest(Long requestId, Long adminId) {
        // 1. Tìm yêu cầu
        JoinGroupRequest request = joinRequestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu tham gia với ID: " + requestId));

        // 2. Kiểm tra trạng thái
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Yêu cầu này đã được xử lý trước đó.");
        }

        // 3. Kiểm tra quyền của người duyệt
        boolean hasPermission = request.getGroup().getOwner().getId().equals(adminId) ||
                groupMemberRepo.findByGroupAndUserId(request.getGroup(), adminId)
                        .map(member -> member.getRole() == MemberRole.MOD)
                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện hành động này với yêu cầu tham gia.");
        }

        return request;
    }
}
