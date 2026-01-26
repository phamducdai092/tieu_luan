export const SubmissionType = {
    INDIVIDUAL: 'INDIVIDUAL',
    GROUP: 'GROUP'
} as const;

export const TaskStatus = {
    ASSIGNED: 'ASSIGNED',
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    REQUEST_CHANGE: 'REQUEST_CHANGE'
}

export type SubmissionType = typeof SubmissionType[keyof typeof SubmissionType];
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];