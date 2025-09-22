package com.web.study.party.utils;

import com.web.study.party.repositories.group.GroupMemberRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PermissionChecker {
    private final GroupMemberRepo memberRepo;

    public void requireOwner(Long uid, Long gid) {
        var gm = memberRepo.findByGroupIdAndUserId(gid, uid)
                .orElseThrow(() -> new IllegalArgumentException("Bạn không phải là thành viên nhóm"));
        if (gm.getRole() != com.web.study.party.entities.enums.MemberRole.OWNER) {
            throw new IllegalArgumentException("Bạn không có quyền thực hiện hành động này");
        }
    }

    public void requireMod(Long uid, Long gid) {
        var gm = memberRepo.findByGroupIdAndUserId(gid, uid)
                .orElseThrow(() -> new IllegalArgumentException("Bạn không phải là thành viên nhóm"));
        if (gm.getRole() != com.web.study.party.entities.enums.MemberRole.OWNER &&
            gm.getRole() != com.web.study.party.entities.enums.MemberRole.MOD) {
            throw new IllegalArgumentException("Bạn không có quyền thực hiện hành động này");
        }
    }
}
