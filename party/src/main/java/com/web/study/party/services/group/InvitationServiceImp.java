package com.web.study.party.services.group;

import com.web.study.party.dto.mapper.group.InvitationMapper;
import com.web.study.party.dto.response.group.InvitationResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.group.GroupInvite;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.exeption.BadRequestException;
import com.web.study.party.exeption.ResourceNotFoundException;
import com.web.study.party.repositories.UserRepo;
import com.web.study.party.repositories.group.GroupInviteRepo;
import com.web.study.party.repositories.group.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.services.mail.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvitationServiceImp implements InvitationService {

    private final GroupInviteRepo groupInviteRepo;
    private final UserRepo userRepo;
    private final GroupRepo groupRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final GroupMemberService groupMemberService;
    private final InvitationMapper invitationMapper;
    private final MailService mailService;

    @Value("${app.base-url.frontend}")
    private String frontendBaseUrl;

    @Override
    @Transactional
    public void createInvitation(Long groupId, Long inviterId, String inviteeEmail) {
        // B1: Tìm các entity cần thiết
        StudyGroups group = groupRepo.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với ID: " + groupId));

        Users inviter = userRepo.findById(inviterId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng (người mời) với ID: " + inviterId));

        // Người được mời có thể chưa có tài khoản, nên ta dùng findByEmail
        Users invitee = userRepo.findByEmail(inviteeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng được mời với email: " + inviteeEmail));


        // B2: Kiểm tra quyền của người mời (Owner hoặc MOD)
        boolean hasPermission = group.getOwner().getId().equals(inviterId) ||
                groupMemberRepo.findByGroupAndUserId(group, inviterId)
                        .map(member -> member.getRole() == MemberRole.MOD || member.getRole() == MemberRole.OWNER)
                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền mời thành viên vào nhóm này.");
        }

        // B3: Kiểm tra xem người được mời đã là thành viên hoặc có yêu cầu/lời mời đang chờ chưa
        if (groupMemberRepo.existsByGroupIdAndUserId(groupId, invitee.getId())) {
            throw new BadRequestException("Người dùng này đã là thành viên của nhóm.");
        }
        if (groupInviteRepo.existsByGroupAndInviteeAndStatus(group, invitee, RequestStatus.PENDING)) {
            throw new BadRequestException("Bạn đã mời người dùng này vào nhóm rồi, vui lòng đợi họ phản hồi.");
        }

        // B4: Tạo token và record lời mời
        String token = UUID.randomUUID().toString();

        GroupInvite invitation = GroupInvite.builder()
                .group(group)
                .inviter(inviter)
                .invitee(invitee)
                .token(token)
                .status(RequestStatus.PENDING)
                .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS)) // Lời mời có hiệu lực trong 7 ngày
                .build();

        groupInviteRepo.save(invitation);

        // B5: Gửi email (Phần này sẽ tích hợp với MailService sau)
        String invitationLink = frontendBaseUrl + "/invites/" + invitation.getToken();
        mailService.sendInvitation(inviteeEmail, inviter.getDisplayName(), group.getName(), invitationLink);
        // System.out.println("Gửi mail mời tới " + inviteeEmail + " với link: " + invitationLink);
    }

    @Override
    @Transactional
    public void acceptInvitation(String token, Long userId) {
        // B1: Tìm lời mời bằng token.
        GroupInvite invite = groupInviteRepo.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lời mời không hợp lệ hoặc đã bị xóa."));

        // B2: Kiểm tra trạng thái và hạn của lời mời.
        if (invite.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Lời mời này đã được xử lý trước đó.");
        }
        if (invite.getExpiresAt() != null && invite.getExpiresAt().isBefore(Instant.now())) {
            invite.setStatus(RequestStatus.EXPIRED); // Cập nhật trạng thái hết hạn
            groupInviteRepo.save(invite);
            throw new BadRequestException("Lời mời này đã hết hạn.");
        }

        // B3: Rất quan trọng - Xác thực đúng người nhận lời mời.
        // Đảm bảo người dùng đang đăng nhập chính là người được mời.
        if (!invite.getInvitee().getId().equals(userId)) {
            throw new AccessDeniedException("Bạn không phải là người nhận được lời mời này.");
        }

        // B4: Mọi thứ hợp lệ -> Thêm thành viên vào nhóm.
        groupMemberService.addMember(invite.getGroup().getId(), invite.getInvitee().getId());

        // B5: Cập nhật trạng thái lời mời.
        invite.setStatus(RequestStatus.ACCEPTED);
        groupInviteRepo.save(invite);
    }

    @Override
    @Transactional
    public void declineInvitation(String token) {
        // B1: Tìm lời mời bằng token.
        GroupInvite invite = groupInviteRepo.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lời mời không hợp lệ hoặc đã bị xóa."));

        // B2: Kiểm tra trạng thái.
        if (invite.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Lời mời này đã được xử lý trước đó.");
        }

        // B3: Cập nhật trạng thái thành "Đã từ chối".
        invite.setStatus(RequestStatus.DECLINED);
        groupInviteRepo.save(invite);
    }

    @Override
    @Transactional
    public void revokeInvitation(Long invitationId, Long ownerId) {
        // B1: Tìm lời mời
        GroupInvite invite = groupInviteRepo.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lời mời với ID: " + invitationId));

        // B2: Kiểm tra quyền (chỉ người mời hoặc owner/mod của nhóm mới có quyền thu hồi)
        boolean hasPermission = invite.getInviter().getId().equals(ownerId) ||
                invite.getGroup().getOwner().getId().equals(ownerId) ||
                groupMemberRepo.findByGroupAndUserId(invite.getGroup(), ownerId)
                        .map(member -> member.getRole() == MemberRole.MOD)
                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền thu hồi lời mời này.");
        }

        // B3: Xóa lời mời
        groupInviteRepo.delete(invite);
    }

    @Override
    public List<InvitationResponse> getPendingInvitationsForGroup(Long groupId, Long ownerId) {
        // B1: Kiểm tra quyền
        StudyGroups group = groupRepo.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với ID: " + groupId));

        boolean hasPermission = group.getOwner().getId().equals(ownerId) ||
                groupMemberRepo.findByGroupAndUserId(group, ownerId)
                        .map(member -> member.getRole() == MemberRole.MOD)
                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền xem danh sách lời mời của nhóm này.");
        }

        // B2: Lấy danh sách lời mời đang chờ
        List<GroupInvite> invites = groupInviteRepo.findByGroupAndStatus(group, RequestStatus.PENDING);

        // B3: Map sang DTO và trả về
        return invites.stream()
                .map(invitationMapper::toResponse)
                .collect(Collectors.toList());
    }
}
