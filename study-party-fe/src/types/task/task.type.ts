import type {SubmissionType, TaskStatus} from "@/types/enum/task.enum.ts";
import type {AttachmentResponse} from "@/types/attachment/attachment.type.ts";
import type {AssigneeResponse, UserBrief} from "@/types/user.type.ts";

export type CreateTaskRequest = {
    title: string;
    description: string;
    deadline: string; // ISO date string
    submissionType: SubmissionType;
    assigneeIds : number[];
}

export type UpdateTaskRequest = {
    title?: string;
    description?: string;
    deadline?: string; // ISO date string
    submissionType?: SubmissionType;
    assigneeIds?: number[];
}

export type SubmitTaskRequest = {
    submissionText: string;
}

export type ReviewSubmissionRequest = {
    status : TaskStatus;
    reviewNotes?: string;
    grade?: number;
}

export type TaskResponse = {
    id: number;
    groupId: number;
    title: string;
    description: string;
    deadline: string; // ISO date string
    submissionType: SubmissionType;
    createdBy: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isDeleted: boolean;
    attachments: AttachmentResponse[];
    assignees: AssigneeResponse[];
}

export type TaskDetailResponse = {
    id: number;
    groupId: number;
    title: string;
    description: string;
    deadline: string; // ISO date string
    submissionType: SubmissionType;
    createdBy: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    attachments: AttachmentResponse[];
    assignees: AssigneeResponse[];
    mySubmission: SubmissionResponse | null;
    totalSubmissions: number;
    approvedSubmissions: number;
}

export type TaskSummaryResponse = {
    id: number;
    title: string;
    deadline: string; // ISO date string
    submissionType: SubmissionType;
    assigneeCount: number;
    mySubmissionStatus: TaskStatus;
    isOverdue?: boolean;
    isDeleted: boolean;
}

export type SubmissionResponse = {
    id: number;
    taskId: number;
    userId: number;
    user: UserBrief;
    submissionText: string;
    status: TaskStatus;
    submittedAt: string; // ISO date string
    reviewedBy: number;
    reviewedByName: string;
    reviewedAt: string; // ISO date string
    reviewNotes?: string;
    grade?: number;
    version: number;
    attachments: AttachmentResponse[];
}
