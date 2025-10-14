package com.web.study.party.services.group;

import com.web.study.party.dto.response.group.JoinRequestResponse;

import java.util.List;

public interface JoinRequestService {
    void createJoinRequest(Long groupId, Long userId);

    List<JoinRequestResponse> getJoinRequestsForGroup(Long groupId, Long ownerId);

    void approveJoinRequest(Long requestId, Long ownerId);

    void rejectJoinRequest(Long requestId, Long ownerId);
}
