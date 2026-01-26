import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Paperclip, X, UploadCloud, Loader2, CheckCircle2, FileText, AlertCircle } from "lucide-react";

import { submitTask } from "@/services/task.service.ts";
import { TaskStatus } from "@/types/enum/task.enum.ts";
import type { AttachmentResponse } from "@/types/attachment/attachment.type.ts";
import type {SubmissionResponse} from "@/types/task/task.type.ts";

// Schema validate nội dung nộp
const submitSchema = z.object({
    submissionText: z.string().optional(),
});

interface TaskSubmissionViewProps {
    groupId: number;
    taskId: number;
    mySubmission: SubmissionResponse;
    deadline?: string;
    onSuccess: () => void;
}

export default function TaskSubmissionView({ groupId, taskId, mySubmission, deadline, onSuccess }: TaskSubmissionViewProps) {
    const [files, setFiles] = useState<File[]>([]);
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(submitSchema),
        defaultValues: {
            submissionText: mySubmission?.submissionText || "",
        },
    });

    const submitMutation = useMutation({
        mutationFn: async (values: z.infer<typeof submitSchema>) => {
            return submitTask(groupId, taskId, {
                submissionText: values.submissionText || "",
            }, files);
        },
        onSuccess: () => {
            toast.success("Nộp bài thành công! Uy tín luôn 💯");
            onSuccess();
            queryClient.invalidateQueries({ queryKey: ["task-detail", taskId] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Lỗi nộp bài rồi 😭");
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const isSubmitted = mySubmission?.status === TaskStatus.SUBMITTED || mySubmission?.status === TaskStatus.APPROVED;
    const isLate = deadline && new Date() > new Date(deadline);

    // --- CASE 1: ĐÃ NỘP BÀI ---
    if (isSubmitted) {
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                {/* Vùng nội dung có scroll */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2 max-h-[65vh] space-y-6">
                    <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2 text-lg">
                                <CheckCircle2 className="h-5 w-5" /> Đã nộp bài thành công
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Nộp lúc: <span className="font-medium text-foreground">{mySubmission.submittedAt ? format(new Date(mySubmission.submittedAt), "HH:mm dd/MM/yyyy", { locale: vi }) : "N/A"}</span>
                            </p>
                            {mySubmission.status === TaskStatus.APPROVED && (
                                <div className="mt-4 p-4 bg-white dark:bg-slate-950 rounded-xl border border-green-200 shadow-sm">
                                    <p className="font-bold text-lg text-green-600">Điểm số: {mySubmission.grade}/100 🌟</p>
                                    {mySubmission.reviewNotes && (
                                        <p className="text-sm mt-1 text-slate-600 italic">"Lời phê: {mySubmission.reviewNotes}"</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Hiển thị bài đã nộp */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase">Nội dung đã gửi</h3>
                        {/* Scroll nhẹ cho phần text nếu quá dài */}
                        <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-sm max-h-60 overflow-y-auto whitespace-pre-line">
                            {mySubmission.submissionText || "Không có nội dung text"}
                        </div>

                        {mySubmission.attachments?.length > 0 && (
                            <div className="grid gap-2">
                                {mySubmission.attachments.map((file: AttachmentResponse, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-slate-950 hover:border-indigo-300 transition-colors">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <a href={file.fileUrl} target="_blank" rel="noreferrer" className="text-sm hover:underline truncate flex-1 text-blue-600 dark:text-blue-400">
                                            {file.fileName}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer fixed */}
                {mySubmission.status !== TaskStatus.APPROVED && (
                    <div className="pt-4 mt-auto border-t bg-white dark:bg-slate-950 z-10">
                        <Button variant="outline" className="w-full" onClick={() => toast.info("Tính năng nộp lại đang phát triển nha!")}>
                            🔄 Nộp lại bài (Re-submit)
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    // --- CASE 2: CHƯA NỘP (FORM) ---
    return (
        <div className="flex flex-col h-full">
            {isLate && (
                <div className="mb-4 shrink-0">
                    <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-900 dark:text-orange-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Đã quá hạn nộp bài!</AlertTitle>
                        <AlertDescription>
                            Bạn đang nộp bài muộn hơn so với hạn chót!
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => submitMutation.mutate(v))} className="flex flex-col h-full gap-4">

                    {/* === SCROLLABLE CONTENT === */}
                    {/* T dùng max-h-[60vh] để đảm bảo nó nằm gọn trong màn hình sheet */}
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6 max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">

                        {/* Text Answer */}
                        <FormField
                            control={form.control}
                            name="submissionText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Câu trả lời / Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập nội dung bài làm hoặc ghi chú cho người chấm..."
                                            className="min-h-[150px] resize-none bg-slate-50 dark:bg-slate-900 focus:bg-white transition-colors"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* File Upload Zone */}
                        <div className="space-y-3">
                            <FormLabel className="font-semibold">File đính kèm</FormLabel>
                            <div
                                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-primary/50 transition-all group"
                                onClick={() => document.getElementById('submission-file')?.click()}
                            >
                                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="h-6 w-6 text-slate-500 group-hover:text-primary" />
                                </div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Bấm vào để tải file bài làm</p>
                                <p className="text-xs text-slate-500 mt-1">Hỗ trợ PDF, Docx, Zip, Image...</p>
                                <Input id="submission-file" type="file" multiple onChange={handleFileChange} className="hidden" />
                            </div>

                            {/* File Preview List - Scroll riêng nếu list dài quá */}
                            {files.length > 0 && (
                                <div className="grid gap-2 animate-in slide-in-from-top-2 max-h-[200px] overflow-y-auto pr-1">
                                    {files.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0">
                                                    <Paperclip className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-sm font-medium truncate max-w-[200px]">{f.name}</span>
                                                    <span className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                                                <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === FIXED FOOTER === */}
                    <div className="pt-2 mt-auto shrink-0 bg-white dark:bg-slate-950 z-10">
                        <Button type="submit" size="lg" className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" disabled={submitMutation.isPending}>
                            {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "🚀 Gửi bài ngay"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}