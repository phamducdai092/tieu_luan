import http from "@/lib/http.ts";
import type { ApiResponse, UnwrappedResponse } from "@/types/api.type.ts";
import type {
    CreateTaskRequest,
    UpdateTaskRequest,
    SubmitTaskRequest,
    ReviewSubmissionRequest,
    TaskResponse,
    TaskDetailResponse,
    TaskSummaryResponse,
    SubmissionResponse,
} from "@/types/task/task.type.ts";
import { TaskStatus } from "@/types/enum/task.enum.ts";

// --- HELPER: Đóng gói FormData chuẩn Spring Boot ---
// Lý do: BE dùng @RequestPart("data") và @RequestPart("files")
// Nên JSON phải được ép kiểu Blob 'application/json' thì BE mới hiểu.
const buildFormData = (jsonData: any, files?: File[]) => {
    const formData = new FormData();

    // 1. Ép JSON thành Blob
    const jsonBlob = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
    });
    formData.append("data", jsonBlob);

    // 2. Nhét file vào (nếu có)
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }

    return formData;
};

// ================= API CALLS =================

// 1. Create Task (Có upload file đề bài)
export const createTask = async (groupId: number, data: CreateTaskRequest, files?: File[]) => {
    const formData = buildFormData(data, files);

    // Lưu ý: Content-Type: multipart/form-data thường được browser tự set khi thấy FormData
    const res = await http.post<ApiResponse<TaskResponse>>(
        `/groups/${groupId}/tasks`,
        formData
    );
    return res.data;
};

// 2. Update Task (Chỉ update info, ko update file ở đây theo logic BE cũ)
export const updateTask = async (
    groupId: number,
    taskId: number,
    data: UpdateTaskRequest,
    files?: File[]
) => {
    const formData = buildFormData(data, files);

    const res = await http.post<ApiResponse<TaskResponse>>(
        `/groups/${groupId}/tasks/${taskId}`,
        formData
    );
    return res.data;
};

// 3. Get Task Details
export const getTaskDetail = async (groupId: number, taskId: number) => {
    const res = await http.get<TaskDetailResponse>(
        `/groups/${groupId}/tasks/${taskId}`
    );
    return res.data;
};

// 4. List Tasks (Có phân trang & Filter)
export const getTasks = async (
    groupId: number,
    params?: { page?: number; size?: number; sort?: string; status?: TaskStatus }
) => {
    const res = await http.get<TaskSummaryResponse[]>(`/groups/${groupId}/tasks`, {
        params: {
            page: params?.page || 0,
            size: params?.size || 12,
            sort: params?.sort,
            status: params?.status
        }
    });
    return res as UnwrappedResponse<TaskSummaryResponse[]>;
};

// 5. Submit Task (Nộp bài + File)
export const submitTask = async (
    groupId: number,
    taskId: number,
    data: SubmitTaskRequest,
    files?: File[]
) => {
    const formData = buildFormData(data, files);

    const res = await http.post<ApiResponse<SubmissionResponse>>(
        `/groups/${groupId}/tasks/${taskId}/submissions`,
        formData
    );
    return res.data;
};

// 6. Review Submission (Chấm bài)
export const reviewSubmission = async (
    groupId: number,
    taskId: number,
    submissionId: number,
    data: ReviewSubmissionRequest
) => {
    const res = await http.put<ApiResponse<SubmissionResponse>>(
        `/groups/${groupId}/tasks/${taskId}/submissions/${submissionId}/review`,
        data
    );
    return res.data;
};

// 7. Get Submissions List (Cho Mod xem ds nộp)
export const getSubmissions = async (
    groupId: number,
    taskId: number,
    params?: { page?: number; size?: number }
) => {
    const res = await http.get<SubmissionResponse[]>(
        `/groups/${groupId}/tasks/${taskId}/submissions`,
        {
            params: {
                page: params?.page || 0,
                size: params?.size || 20 // Default size to hơn chút
            }
        }
    );
    return res as UnwrappedResponse<SubmissionResponse[]>;
};

// 8. Delete Task
export const deleteTask = async (groupId: number, taskId: number) => {
    const res = await http.delete<ApiResponse<void>>(
        `/groups/${groupId}/tasks/${taskId}`
    );
    return res.data;
};