package com.web.study.party.services.user;

import com.web.study.party.dto.request.user.UserInformationUpdateRequest;
import com.web.study.party.dto.response.user.UserInformationResponse;
import com.web.study.party.dto.response.user.UserSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserInformationResponse updateUser(Long id, UserInformationUpdateRequest request);
    UserInformationResponse getUserById(Long userId);
    Page<UserSearchResponse> searchUsers(String keyword, Pageable pageable);
}
