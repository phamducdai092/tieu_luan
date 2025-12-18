import type {UserBrief} from "@/types/user.type.ts";
import type {MemberRole} from "@/types/enum/group.enum.ts";

export type RoomState = {
    userRoomsJoined: Room[];
    userRoomsOwned: Room[];
    setRoomsUserJoined: (rooms: Room[]) => void;
    setRoomsUserOwned: (rooms: Room[]) => void;
}

export type Room = {
    id: string;
    name: string;
    slug: string;
    description: string;
    topic: string;
    topicColor: string;
    maxMembers: number;
    memberCount: number;
    ownerId: number;
    createdAt: string;
};


export type RoomDetail = {
    id: number;
    name: string;
    slug: string;
    description: string;
    topic: string;
    topicColor: string;
    maxMembers: number;
    memberCount: number;
    groupPrivacy: string;
    joinPolicy: string
    owner: UserBrief;
    currentUserRole: MemberRole;
}

export type RoomCreatePayload = {
    name: string;
    description?: string;
    
};

export type TopicProps = {
    topic: string;
    color?: string;
    className?: string;
    size?: "sm" | "md";
};

export type TopicColorState = {
    map: Record<string, string>; // topic -> hsl(...) | #hex
    setMany: (entries: Array<{ topic: string; color: string }>) => void;
    setOne: (topic: string, color: string) => void;
    getColor: (topic: string) => string;
};
