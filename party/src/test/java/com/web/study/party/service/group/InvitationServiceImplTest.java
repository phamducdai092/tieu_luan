package com.web.study.party.service.group;

import com.web.study.party.entities.Users;
import com.web.study.party.entities.group.GroupInvite;
import com.web.study.party.entities.group.GroupMembers;
import com.web.study.party.entities.group.StudyGroups;
import com.web.study.party.entities.enums.group.RequestStatus;
import com.web.study.party.entities.enums.group.MemberRole;
import com.web.study.party.exception.BadRequestException;
import com.web.study.party.repositories.user.UserRepo;
import com.web.study.party.repositories.group.invite.GroupInviteRepo;
import com.web.study.party.repositories.group.member.GroupMemberRepo;
import com.web.study.party.repositories.group.GroupRepo;
import com.web.study.party.services.group.GroupMemberService;
import com.web.study.party.services.group.InvitationServiceImp;
import com.web.study.party.services.mail.MailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvitationServiceImplTest {

    @Mock
    private GroupInviteRepo groupInviteRepo;
    @Mock
    private GroupRepo groupRepo;
    @Mock
    private UserRepo userRepo;
    @Mock
    private GroupMemberRepo groupMemberRepo;
    @Mock
    private GroupMemberService groupMemberService;
    @Mock
    private MailService mailService; // Mock luôn service gửi mail

    @InjectMocks
    private InvitationServiceImp invitationService;

    @Test
    void createInvitation_WhenSuccess_ShouldSaveAndSendEmail() {
        // GIVEN
        Long groupId = 1L, inviterId = 10L;
        String inviteeEmail = "invitee@example.com";
        Users inviter = Users.builder().id(inviterId).displayName("Inviter").build();
        Users invitee = Users.builder().id(20L).email(inviteeEmail).build();
        StudyGroups group = StudyGroups.builder().id(groupId).owner(Users.builder().id(1L).build()).name("Test Group").build();
        String slug = group.getSlug();
        // Giả lập quyền của người mời là MOD
        when(groupRepo.findById(groupId)).thenReturn(Optional.of(group));
        when(userRepo.findById(inviterId)).thenReturn(Optional.of(inviter));
        when(userRepo.findByEmail(inviteeEmail)).thenReturn(Optional.of(invitee));
        when(groupMemberRepo.findByGroupAndUserId(group, inviterId))
                .thenReturn(Optional.of(GroupMembers.builder().role(MemberRole.MOD).build()));
        // Giả lập người được mời chưa phải là thành viên và chưa có lời mời nào
        when(groupMemberRepo.existsByGroupIdAndUserId(groupId, invitee.getId())).thenReturn(false);
        when(groupInviteRepo.existsByGroupAndInviteeAndStatus(group, invitee, RequestStatus.PENDING)).thenReturn(false);

        // WHEN
        invitationService.createInvitation(slug, inviterId, inviteeEmail);

        // THEN
        // Bắt lại đối tượng GroupInvite được truyền vào hàm save
        ArgumentCaptor<GroupInvite> inviteCaptor = ArgumentCaptor.forClass(GroupInvite.class);
        verify(groupInviteRepo, times(1)).save(inviteCaptor.capture());
        
        GroupInvite savedInvite = inviteCaptor.getValue();
        assertEquals(RequestStatus.PENDING, savedInvite.getStatus());
        assertNotNull(savedInvite.getToken());
        assertEquals(group, savedInvite.getGroup());
        assertEquals(invitee, savedInvite.getInvitee());

        // Kiểm tra hàm gửi mail có được gọi không (chưa cần kiểm tra nội dung mail vội)
        verify(mailService, times(1)).sendInvitation(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void acceptInvitation_WhenSuccess_ShouldAddMemberAndUpdateStatus() {
        // GIVEN
        String token = "valid-token";
        Long userId = 20L;
        Long groupId = 1L;

        Users invitee = Users.builder().id(userId).build();
        StudyGroups group = StudyGroups.builder().id(groupId).build();
        GroupInvite invite = GroupInvite.builder()
                .id(100L)
                .token(token)
                .invitee(invitee)
                .group(group)
                .status(RequestStatus.PENDING)
                .expiresAt(Instant.now().plus(1, ChronoUnit.DAYS)) // Lời mời còn hạn
                .build();
        
        when(groupInviteRepo.findByToken(token)).thenReturn(Optional.of(invite));

        // WHEN
        invitationService.acceptInvitation(token, userId);

        // THEN
        // Kiểm tra có gọi hàm thêm thành viên không
        verify(groupMemberService, times(1)).addMember(groupId, userId);
        
        // Kiểm tra trạng thái lời mời đã được cập nhật
        assertEquals(RequestStatus.ACCEPTED, invite.getStatus());
        verify(groupInviteRepo, times(1)).save(invite);
    }
    
    @Test
    void acceptInvitation_WhenTokenIsExpired_ShouldThrowException() {
        // GIVEN
        String token = "expired-token";
        Long userId = 20L;
        GroupInvite expiredInvite = GroupInvite.builder()
                .status(RequestStatus.PENDING)
                .expiresAt(Instant.now().minus(1, ChronoUnit.DAYS)) // Lời mời đã hết hạn
                .build();
        
        when(groupInviteRepo.findByToken(token)).thenReturn(Optional.of(expiredInvite));

        // WHEN & THEN
        assertThrows(BadRequestException.class, () -> invitationService.acceptInvitation(token, userId));

        // Kiểm tra trạng thái đã được tự động cập nhật thành EXPIRED
        assertEquals(RequestStatus.EXPIRED, expiredInvite.getStatus());
        verify(groupMemberService, never()).addMember(any(), any());
    }
}