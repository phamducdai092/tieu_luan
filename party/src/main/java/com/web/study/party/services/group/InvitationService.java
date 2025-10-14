package com.web.study.party.services.group;

import java.util.List;
import com.web.study.party.dto.response.group.InvitationResponse;

public interface InvitationService {

    void createInvitation(Long groupId, Long inviterId, String inviteeEmail);

    void acceptInvitation(String token, Long userId);

    void declineInvitation(String token);

    void revokeInvitation(Long invitationId, Long ownerId);

    List<InvitationResponse> getPendingInvitationsForGroup(Long groupId, Long ownerId);

}
