export type Achievement = {
    id: string;
    title: string;
    value: string; // e.g. "48 giờ", "15 thẻ"
    description?: string;
    date?: string; // ISO string
};