package com.web.study.party.services.group;

import java.util.List;
import com.web.study.party.dto.response.group.InvitationResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.group.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InvitationService {

    void createInvitation(String slug, Long inviterId, String inviteeEmail);

    void acceptInvitation(String token, Long userId);

    void declineInvitation(String token);

    void revokeInvitation(Long invitationId, Long ownerId);

    Page<InvitationResponse> getPendingInvitationsForGroup(String slug, Long ownerId, RequestStatus status, String keyword, Pageable pageable);
    Page<InvitationResponse> getPendingInvitationsForUser(Users invitee, RequestStatus status, String keyword, Pageable pageable);

}
