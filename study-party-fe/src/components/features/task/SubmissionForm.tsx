import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileIcon, X } from "lucide-react";
import { toast } from "sonner";
import {submitTask} from "@/services/task.service.ts";


interface SubmissionFormProps {
    groupId: number;
    taskId: number;
    onSuccess: () => void;
}

export default function SubmissionForm({ groupId, taskId, onSuccess }: SubmissionFormProps) {
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!text && files.length === 0) {
            toast.error("Vui lòng nhập nội dung hoặc đính kèm file");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitTask(
                groupId,
                taskId,
                { submissionText: text },
                files
            );
            toast.success("Nộp bài thành công! 🎉");
            setFiles([]);
            setText("");
            onSuccess();
        } catch (error: any) {
            toast.error("Lỗi nộp bài: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Lời nhắn / Ghi chú</Label>
                <Textarea
                    placeholder="Em nộp bài ạ..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>File bài làm</Label>

                {/* Dropzone fake */}
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition relative">
                    <input
                        type="file"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <UploadCloud className="w-10 h-10 mb-2 text-primary/50" />
                    <p className="text-sm font-medium">Click để chọn file hoặc kéo thả vào đây</p>
                    <p className="text-xs text-muted-foreground mt-1">Hỗ trợ PDF, Word, Ảnh (Max 50MB)</p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-2 mt-2">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded bg-background text-sm">
                                <div className="flex items-center gap-2 truncate">
                                    <FileIcon className="w-4 h-4 text-blue-500" />
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)}KB)</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(idx)}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
            </Button>
        </div>
    );
}