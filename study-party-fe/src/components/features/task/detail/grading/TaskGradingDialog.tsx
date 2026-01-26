import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FileText, Download, Maximize2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { reviewSubmission } from "@/services/task.service";
import { TaskStatus } from "@/types/enum/task.enum";
import type { SubmissionResponse } from "@/types/task/task.type";
import type { AttachmentResponse } from "@/types/attachment/attachment.type.ts";

import GradingSidebar, {type GradingFormValues } from "./GradingSidebar";

interface TaskGradingDialogProps {
    groupId: number;
    taskId: number;
    submission: SubmissionResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TaskGradingDialog({ groupId, taskId, submission, isOpen, onClose }: TaskGradingDialogProps) {
    const queryClient = useQueryClient();

    // Mutation giữ ở cha để control flow sau khi submit xong (đóng dialog, invalidate query)
    const mutation = useMutation({
        mutationFn: (values: GradingFormValues) =>
            reviewSubmission(groupId, taskId, submission!.id, values),
        onSuccess: () => {
            toast.success("Đã chấm điểm thành công! 🌟");
            queryClient.invalidateQueries({ queryKey: ["task-submissions", taskId] });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Lỗi chấm bài")
    });

    if (!submission) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[95vw] md:max-w-7xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl rounded-xl">

                {/* --- HEADER --- */}
                <DialogHeader className="px-6 py-4 border-b bg-white dark:bg-slate-900 z-10 shrink-0 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-slate-100 shadow-sm">
                            <AvatarImage src={submission.user.avatarUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                                {submission.user.displayName?.substring(0, 1)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 text-left">
                            <DialogTitle className="text-xl flex items-center gap-2">
                                {submission.user.displayName}
                                <span className="text-muted-foreground font-normal text-sm"> — Bài làm</span>
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-3 text-xs font-medium">
                                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                    🕒 {submission.submittedAt ? format(new Date(submission.submittedAt), "HH:mm dd/MM/yyyy", { locale: vi }) : "Chưa nộp"}
                                </span>
                                {submission.status === TaskStatus.SUBMITTED && (
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">⏳ Chờ chấm</Badge>
                                )}
                                {submission.status === TaskStatus.APPROVED && (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">✅ Đã chấm</Badge>
                                )}
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold tracking-widest opacity-50">
                        <Maximize2 className="h-4 w-4" /> Grading Mode
                    </div>
                </DialogHeader>

                {/* --- BODY --- */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-50/50 dark:bg-black/20">

                    {/* COLUMN 1: STUDENT WORK (TĨNH - KHÔNG BỊ RE-RENDER KHI GÕ PHÍM NỮA) */}
                    <div className="flex-1 overflow-hidden flex flex-col border-r border-slate-200 dark:border-slate-800 relative">
                        <ScrollArea className="flex-1 h-full">
                            <div className="p-8 lg:p-10 max-w-5xl mx-auto space-y-8">
                                {/* Text Content */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <FileText className="h-4 w-4"/> Nội dung bài làm
                                    </h4>
                                    <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm text-base leading-loose text-slate-800 dark:text-slate-200 whitespace-pre-line min-h-[200px]">
                                        {submission.submissionText || (
                                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground italic gap-3 opacity-60">
                                                <FileText className="h-10 w-10 stroke-1"/>
                                                <span className="text-lg">Trống trơn... không có chữ nào cả!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Attachments */}
                                {submission.attachments && submission.attachments.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                            <Download className="h-4 w-4" /> File đính kèm ({submission.attachments.length})
                                        </h4>
                                        <div className="flex flex-col gap-3">
                                            {submission.attachments.map((file: AttachmentResponse, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 hover:shadow-md transition-all group relative overflow-hidden"
                                                >
                                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <FileText className="h-5 w-5"/>
                                                    </div>

                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <a
                                                            href={file.fileUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm sm:text-base hover:text-indigo-600 hover:underline transition-colors block"
                                                        >
                                                            {file.fileName}
                                                        </a>
                                                        <p className="text-xs text-muted-foreground mt-0.5">Click tên file hoặc nút bên cạnh</p>
                                                    </div>

                                                    <div className="shrink-0">
                                                        <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50" asChild>
                                                            <a href={file.fileUrl} target="_blank" rel="noreferrer">
                                                                <Download className="h-5 w-5"/>
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* COLUMN 2: GRADING SIDEBAR (Component mới) */}
                    <GradingSidebar
                        submission={submission}
                        isPending={mutation.isPending}
                        onSubmit={(values) => mutation.mutate(values)}
                        onClose={onClose}
                    />

                </div>
            </DialogContent>
        </Dialog>
    );
}