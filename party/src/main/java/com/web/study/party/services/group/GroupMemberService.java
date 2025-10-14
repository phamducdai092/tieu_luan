package com.web.study.party.services.group;

import com.web.study.party.entities.enums.group.MemberRole;

public interface GroupMemberService {

    void addMember(Long groupId, Long userId);

    void leave(Long uid, Long gid);

    void kick(Long modId, Long gid, Long userId);

    void setRole(Long ownerId, Long gid, Long userId, MemberRole role);

    void transferOwnership(Long ownerId, Long gid, Long newOwnerId);
}
