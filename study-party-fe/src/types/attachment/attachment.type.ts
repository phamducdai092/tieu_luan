export type AttachmentResponse = {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number; // in bytes
    uploadedAt: string; // ISO date string
    uploadById: number;
}