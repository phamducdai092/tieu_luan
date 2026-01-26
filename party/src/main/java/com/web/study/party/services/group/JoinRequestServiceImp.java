package com.web.study.party.services.group;

import com.web.study.party.dto.mapper.group.GroupMapper;
import com.web.study.party.dto.mapper.group.JoinRequestMapper;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.dto.response.group.JoinRequestResponse;
import com.web.study.party.dto.response.user.UserJoinRequestResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.JoinPolicy;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.JoinGroupRequest;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.exception.BadRequestException;
import com.web.study.party.exception.ResourceNotFoundException;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.repositories.group.JoinGroupRequestRepo;
import com.web.study.party.services.notification.NotificationService;
import com.web.study.party.utils.socket.SocketConst;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JoinRequestServiceImp implements JoinRequestService {

    private final GroupRepo groupRepo;
    private final UserRepo userRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final JoinGroupRequestRepo joinRequestRepo;
    private final JoinRequestMapper joinRequestMapper;
    private final GroupMapper groupMapper;
    private final GroupMemberService groupMemberService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void createJoinRequest(String slug, Long userId) {
        // B1: Tìm group và user. Dùng orElseThrow để bắn exception nếu không tìm thấy.
        StudyGroups group = groupRepo.findStudyGroupBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với url: " + slug));

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        // B2: Kiểm tra chính sách tham gia của nhóm.
        if (group.getJoinPolicy() == JoinPolicy.INVITE_ONLY) {
            throw new BadRequestException("Bạn cần lời mời dể tham gia nhóm này.");
        }

        if (group.getJoinPolicy() == JoinPolicy.OPEN) {
            // Nếu là OPEN thì tự động thêm thành viên mà không cần tạo yêu cầu
            groupMemberService.addMember(group.getId(), userId);
            return;
        }

        // B3: Kiểm tra xem user đã là thành viên chưa.
        boolean isAlreadyMember = groupMemberRepo.existsByGroupIdAndUserId(group.getId(), userId);
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

        Users owner = group.getOwner();
        String notifContent = user.getDisplayName() + " muốn tham gia nhóm " + group.getName();
        String link = "/rooms/" + group.getSlug() + "?tab=requests"; // Link đến tab quản lý

        // Gửi cho Owner
        notificationService.sendNotification(owner, notifContent, link, SocketConst.EVENT_JOIN_REQUEST);

        // 2. Gửi cho các Mod (Lọc ra các member có role MOD)
        List<Users> mods = groupMemberRepo.findModsBySlug(slug);
        for (Users mod : mods) {
            notificationService.sendNotification(mod, notifContent, link, SocketConst.EVENT_JOIN_REQUEST);
        }
    }

    @Override
    @Transactional
    public void cancelJoinRequest(String slug, Long userId) {
        StudyGroups group = groupRepo.findStudyGroupBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với url: " + slug));

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        JoinGroupRequest request = joinRequestRepo.findByGroupAndUserAndStatus(group, user, RequestStatus.PENDING)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu tham gia nào để hủy."));

        request.setStatus(RequestStatus.CANCELED);
        request.setResolvedAt(Instant.now());
        request.setResolver(user); // Người hủy là chính user đó
        joinRequestRepo.save(request);
    }

    @Override
    @Transactional
    public Page<JoinRequestResponse> getJoinRequestsForGroup(String slug, Long ownerId, Pageable pageable) {
        StudyGroups group = groupRepo.findStudyGroupBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với url: " + slug));

        // Kiểm tra xem người dùng có phải là OWNER hoặc MOD không
        boolean hasPermission = group.getOwner().getId().equals(ownerId) ||
                groupMemberRepo.findByGroupAndUserId(group, ownerId)
                        .map(member -> member.getRole() == MemberRole.MOD) // Sửa ADMIN thành MOD
                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền xem danh sách yêu cầu của nhóm này.");
        }

        Page<JoinGroupRequest> requests = joinRequestRepo.findByGroupAndStatus(group, RequestStatus.PENDING, pageable);

        return requests.map(joinRequestMapper::toResponse);
    }

    @Override
    public Page<UserJoinRequestResponse> getJoinRequestsForUser(Long userId, Pageable pageable) {
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        Page<JoinGroupRequest> requestPage = joinRequestRepo.findByUser(user, pageable);

        if (requestPage.isEmpty()) {
            return Page.empty(pageable);
        }

        Page<JoinRequestResponse> responsePage = requestPage.map(joinRequestMapper::toResponse);

        Set<Long> groupIds = responsePage.getContent().stream()
                .map(JoinRequestResponse::groupId)
                .collect(Collectors.toSet());

        List<StudyGroups> groups = groupRepo.findAllById(groupIds);

        Map<Long, GroupResponse> groupMap = groups.stream()
                .map(groupMapper::toResponse)
                .collect(Collectors.toMap(GroupResponse::id, Function.identity()));

        List<UserJoinRequestResponse> content = requestPage.getContent().stream()
                .map(requestEntity -> {
                    // Map request entity sang DTO
                    JoinRequestResponse requestDto = joinRequestMapper.toResponse(requestEntity);

                    // Lấy Group DTO từ Map dựa vào ID
                    // Dùng getOrDefault hoặc check null phòng trường hợp Group bị xóa cứng
                    GroupResponse groupDto = groupMap.get(requestDto.groupId());

                    return new UserJoinRequestResponse(requestDto, groupDto);
                })
                .toList();

        return new PageImpl<>(content, pageable, requestPage.getTotalElements());
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

        Users requester = request.getUser();
        StudyGroups group = request.getGroup();

        String content = String.format("Yêu cầu tham gia nhóm '%s' của bạn đã được chấp nhận!", group.getName());
        String link = "/rooms/" + group.getSlug();

        notificationService.sendNotification(
                requester,
                content,
                link,
                SocketConst.EVENT_REQUEST_APPROVED
        );
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

        Users requester = request.getUser();
        StudyGroups group = request.getGroup();

        String content = String.format("Rất tiếc, yêu cầu tham gia nhóm '%s' của bạn đã bị từ chối.", group.getName());
        String link = ""; // Không có link, hoặc link về trang search

        notificationService.sendNotification(
                requester,
                content,
                link,
                SocketConst.EVENT_REQUEST_REJECTED // Type: REQUEST_REJECTED
        );
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
