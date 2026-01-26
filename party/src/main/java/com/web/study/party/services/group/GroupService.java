package com.web.study.party.services.group;

import com.web.study.party.dto.request.group.GroupCreateRequest;
import com.web.study.party.dto.response.group.GroupCardResponse;
import com.web.study.party.dto.response.group.GroupDetailResponse;
import com.web.study.party.dto.response.group.GroupResponse;
import com.web.study.party.entities.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GroupService {

    Page<GroupResponse> getAllByUserId(Long uid);
    Page<GroupResponse> getAll();

    // group
    GroupResponse create(Long uid, GroupCreateRequest req);
    GroupResponse update(Long uid, String slug, GroupCreateRequest req);

    Page<GroupCardResponse> getJoinedGroups(Long userId, Pageable pageable);
    Page<GroupCardResponse> getOwnedGroups(Long userId, Pageable pageable);
    Page<GroupCardResponse> getDiscoverGroups(Long userId, Pageable pageable);

    GroupDetailResponse getDetailBySlug(String slug, Users currentUser);

    void delete(Long uid, String slug);
}
