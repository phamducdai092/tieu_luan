export const AccountStatusType = {
    ACTIVE: 'ACTIVE',
    BANNED: 'BANNED',
    DEACTIVATED: 'DEACTIVATED'
}

export type AccountStatus = typeof AccountStatusType[keyof typeof AccountStatusType];