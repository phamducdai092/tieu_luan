import type {Room} from "@/types/group/group.type.ts";
import type {Achievement} from "@/types/achivement.type.ts";
import type {FlashcardSet} from "@/types/flashcard.type.ts";
import type {SharedFile} from "@/types/file.type.ts";

export type User = {
    id: number;
    avatarUrl?: string;
    bannerUrl?: string;
    displayName?: string | "Bạn mới";
    email: string;
    looked: boolean;
    online: boolean;
    verified: boolean;
    bio?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    role: 'USER' | 'ADMIN';
};

export type UserBrief = {
    id: number;
    avatarUrl?: string;
    displayName?: string | "Chưa đặt tên";
}

export type UserInformationUpdatePayload = {
    avatarUrl?: string;
    bannerUrl?: string;
    displayName?: string;
    bio?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
}

export type UserInformationResponse = {
    id: number;
    email: string;
    avatarUrl: string;
    bannerUrl: string;
    displayName: string;
    bio: string;
    phoneNumber: string;
    dateOfBirth: string;
}

export interface ProfilePageProps {
    user?: User;
    rooms?: Room[];
    achievements?: Achievement[];
    flashcards?: FlashcardSet[];
    files?: SharedFile[];
}