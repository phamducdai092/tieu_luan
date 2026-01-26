import type {Role} from "@/types/enum/role.type.ts";
import type {AccountStatus} from "@/types/enum/account.status.type.ts";

export interface AdminQueryParams {
    keyword?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    order?: "asc" | "desc";
}

export type AdminDashboardResponse = {
    totalUsers: number;
    totalGroups: number;
    totalFiles: number;
    newUsersToday: number;
    newGroupsToday: number;
}

export type AdminUsersResponse = {
    id: number;
    email: string;
    avatarUrl?: string;
    bannerUrl?: string;
    displayName: string;
    bio?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    emailVerifiedAt: string;
    role: Role;
    accountStatus: AccountStatus;
}

export type AdminGroupsResponse = {
    id: number;
    name: string;
    slug: string;
    description: string;
    topic: string;
    topicColor: string;
    maxMembers: number;
    memberCount: number;
    ownerId: number;
    createdAt: string;
    deleted: boolean;
    active: boolean;
}

export type AdminFileResponse = {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    uploadedById: number;
}