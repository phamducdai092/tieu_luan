export const MemberRoleEnum = {
    OWNER: 'OWNER',
    MOD: 'MOD',
    MEMBER: 'MEMBER',
    GUEST: 'GUEST'
} as const;

export const GroupPrivacyEnum = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
} as const;

export const JoinPolicyEnum = {
    OPEN: 'OPEN',
    ASK: 'ASK',
    INVITE_ONLY: 'INVITE_ONLY'
} as const;

export const MemberStateEnum = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    BANNED: 'BANNED'
}

export type MemberRole = typeof MemberRoleEnum[keyof typeof MemberRoleEnum];
export type GroupPrivacy = typeof GroupPrivacyEnum[keyof typeof GroupPrivacyEnum];
export type JoinPolicy = typeof JoinPolicyEnum[keyof typeof JoinPolicyEnum];
export type MemberState = typeof MemberStateEnum[keyof typeof MemberStateEnum];