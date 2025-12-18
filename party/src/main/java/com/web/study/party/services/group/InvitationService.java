package com.web.study.party.services.group;

import java.util.List;
import com.web.study.party.dto.response.group.InvitationResponse;
import com.web.study.party.entities.Users;

public interface InvitationService {

    void createInvitation(String slug, Long inviterId, String inviteeEmail);

    void acceptInvitation(String token, Long userId);

    void declineInvitation(String token);

    void revokeInvitation(Long invitationId, Long ownerId);

    List<InvitationResponse> getPendingInvitationsForGroup(String slug, Long ownerId);

    List<InvitationResponse> getPendingInvitationsForUser(Users invitee);

}
