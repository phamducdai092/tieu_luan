package com.web.study.party.services.group;

import com.web.study.party.dto.response.group.JoinRequestResponse;
import com.web.study.party.dto.response.user.UserJoinRequestResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JoinRequestService {
    void createJoinRequest(String slug, Long userId);
    void cancelJoinRequest(String slug, Long userId);

    void approveJoinRequest(Long requestId, Long ownerId);
    void rejectJoinRequest(Long requestId, Long ownerId);

    Page<JoinRequestResponse> getJoinRequestsForGroup(String slug, Long ownerId, Pageable pageable);
    Page<UserJoinRequestResponse> getJoinRequestsForUser(Long userId, Pageable pageable);
}
