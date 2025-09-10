export type Room = {
    id: string;
    topic: string;
    groupName: string;
    memberCount: number;
    onlineCount: number;
    owner: string;
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