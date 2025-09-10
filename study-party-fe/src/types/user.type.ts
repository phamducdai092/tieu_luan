import type {Room} from "@/types/group.type.ts";
import type {Achievement} from "@/types/achivement.type.ts";
import type {FlashcardSet} from "@/types/flashcard.type.ts";
import type {SharedFile} from "@/types/file.type.ts";

export type User = {
    id: number;
    avatar_url?: string;
    display_name: string | "Bạn mới";
    email: string;
    looked: boolean;
    online: boolean;
    verified: boolean;
    bio: string;
    phone_number?: string;
    date_of_birth?: string;
    role: 'USER' | 'ADMIN';
};

export interface ProfilePageProps {
    user?: User;
    rooms?: Room[];
    achievements?: Achievement[];
    flashcards?: FlashcardSet[];
    files?: SharedFile[];
}