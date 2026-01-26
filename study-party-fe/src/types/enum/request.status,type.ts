export const RequestStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    DECLINED: 'DECLINED',
    CANCELED: 'CANCELED',
    EXPIRED: 'EXPIRED'
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];