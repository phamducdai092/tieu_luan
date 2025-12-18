import type {PagingResponse} from "@/types/paging.type.ts";
import type {AxiosResponse} from "axios";

export type FieldError = {
    field?: string;
    message: string;
    rejectedValue?: object;
}

export type ApiResponse<T> = {
    timestamp: string;
    path: string;
    status: number;
    code: string;       // ví dụ: "Request was successful"
    message: string;    // ví dụ: "Lấy dữ liệu thành công"
    data: T | null;
    meta: PagingResponse | null;
};

export type ApiError = {
    timestamp: string;
    path: string;
    status: number;
    code: string;
    message: string;
    fieldErrors: FieldError[]
}

export type UnwrappedResponse<T> = AxiosResponse<T> & {
    meta?: PagingResponse | null;
};