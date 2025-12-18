export type PagingPayload = {
    page?: number;
    size?: number;
    sort?: string;
    topic?: string;
    keyword?: string;
}

export type PagingResponse = {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    sort: string;
    filter: string;
}