
export type EnumItem = {
    code: string;
    label: string;
    description?: string;
    color: string;
    icon: string;
    order: number;
    active: boolean;
};

export type EnumGroup = {
    name: string;        // ví dụ: "AccountStatusType"
    items: EnumItem[];
};

export type EnumDict = Record<string, EnumItem[]>;

export type EnumState = {
    enums: EnumDict;
    version?: string;
    setEnums: (groups: EnumGroup[], version?: string) => void;
    get: (name: string) => EnumItem[];
};
