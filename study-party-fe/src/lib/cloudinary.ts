import axios from "axios";
import type {CloudinaryUploadResult, UploadOptions} from "@/types/cloudinary.type.ts";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const DEFAULT_UPLOAD_PRES1QET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!; // unsigned preset

export async function uploadToCloudinary(
    fileOrUrl: File | Blob | string,       // nhận File/Blob hoặc URL từ xa
    opts: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
    if (!fileOrUrl) throw new Error("No file provided");
    if (!CLOUD_NAME) throw new Error("Missing VITE_CLOUDINARY_CLOUD_NAME");

    const resource = opts.resourceType ?? "auto";
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resource}/upload`;

    const form = new FormData();
    form.append("file", fileOrUrl);       // tên field bắt buộc là 'file'

    // --- Auth mode ---
    const useUnsigned = opts.unsigned !== false; // default true
    if (useUnsigned) {
        const preset = opts.uploadPreset ?? DEFAULT_UPLOAD_PRESET;
        if (!preset) throw new Error("Missing Cloudinary upload preset");
        form.append("upload_preset", preset);
    } else {
        if (!opts.signatureData) throw new Error("Missing signatureData for signed upload");
        form.append("api_key", opts.signatureData.apiKey);
        form.append("timestamp", String(opts.signatureData.timestamp));
        form.append("signature", opts.signatureData.signature);
    }

    // --- Common options ---
    if (opts.folder) form.append("folder", opts.folder);
    if (opts.tags?.length) form.append("tags", opts.tags.join(","));
    if (opts.publicId) form.append("public_id", opts.publicId);
    if (typeof opts.overwrite === "boolean") form.append("overwrite", String(opts.overwrite));
    if (opts.context && Object.keys(opts.context).length) {
        // key=value|key2=value2
        const ctx = Object.entries(opts.context).map(([k, v]) => `${k}=${v}`).join("|");
        form.append("context", ctx);
    }
    if (opts.eager) {
        const eager = Array.isArray(opts.eager) ? opts.eager.join("|") : opts.eager;
        form.append("eager", eager);
    }
    if (opts.returnDeleteToken) form.append("return_delete_token", "true");

    // ❗Không set 'Content-Type' để browser tự thêm boundary
    const res = await axios.post<CloudinaryUploadResult>(url, form, {
        onUploadProgress: (e) => {
            if (opts.onProgress && e.total) {
                opts.onProgress(Math.round((e.loaded / e.total) * 100));
            }
        },
    });

    if (!res?.data?.secure_url) throw new Error("Upload ok nhưng thiếu secure_url");
    return res.data;
}
